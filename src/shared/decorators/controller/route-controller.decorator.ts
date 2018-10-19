import { Router, RequestHandler } from 'express';
import { LoggerService } from '../../../services/logger.service';
import { ApiMethod } from './api-methods.enum';

class RouteControllerDecorator {
    public static RouteController(options: ControllerOptions) {
        return function (target: any) {
            const controllerRouter = Router();
            target.prototype.basePath = options.basePath;
            target.prototype.router = controllerRouter;
            target.prototype.logger = new LoggerService(options.loggerContext);
            options.childrenControllers.map((controller: Controller) => {
                controllerRouter.use(controller.basePath, controller.router);
            });
            if (Array.isArray(target.prototype.routeConfigurations)) {
                target.prototype.routeConfigurations.map((configuration: RouteConfiguration) => {
                    RouteControllerDecorator.configureRouterHandler(configuration, controllerRouter);
                });
            }
    
            return target;
        }
    }

    private static configureRouterHandler(options: RouteConfiguration, router: Router): void {
        switch (options.method) {
            case ApiMethod.GET:
                router.get(options.path, options.middleware || [], options.handler);
                break;
            case ApiMethod.POST:
                router.post(options.path, options.middleware || [], options.handler);
                break;
            case ApiMethod.PUT:
                router.put(options.path, options.middleware || [], options.handler);
                break;
            case ApiMethod.DELETE:
                router.delete(options.path, options.middleware || [], options.handler);
                break;
        }
    }
}

export interface Controller {
    router: Router;
    basePath: string;
    logger: LoggerService;
}

export interface ControllerOptions {
    basePath: string;
    loggerContext: string;
    childrenControllers: any[];
}

interface RouteConfiguration {
    router: Router;
    path: string;
    middleware: RequestHandler[];
    method: ApiMethod;
    handler: RequestHandler;
}

export default RouteControllerDecorator.RouteController;
