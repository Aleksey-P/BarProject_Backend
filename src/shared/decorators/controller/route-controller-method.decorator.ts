import { ApiMethod } from './api-methods.enum';
import { Response, RequestHandler } from 'express';
import { BaseResponse, SuccessResponse, ClientErrorResponse, ServerErrorResponse } from '../../classes/server-response.class';
import { LoggerService } from '../../../services/logger.service';
import { ClientError } from '../../classes/errors/client-error.class';
import { Controller } from './route-controller.decorator';

class RouteControllerMethodDecorator {
    public static RouteControllerMethod(options: RouteControllerMethodOptions) {
        return function (target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
            const originalMethod = descriptor.value;
            target = target as Controller;

            descriptor.value = async function () {
                let result: any;
                const expressResponse: Response = arguments[1];
                const logger = target.logger;

                try {
                    result = await originalMethod.apply(target, arguments);
                    RouteControllerMethodDecorator.response(expressResponse, new SuccessResponse(result), logger);
                } catch (e) {
                    let appResponse: BaseResponse;
                    if (e instanceof ClientError) {
                        appResponse = new ClientErrorResponse(e.message);
                    } else {
                        appResponse = new ServerErrorResponse(e.message);
                    }

                    RouteControllerMethodDecorator.response(expressResponse, appResponse, logger);
                }

                return result;
            };
            RouteControllerMethodDecorator.addRouteConfiguration(target, descriptor, options);

            return descriptor;
        }
    }

    private static addRouteConfiguration(target: any, descriptor: PropertyDescriptor, options: RouteControllerMethodOptions): void {
        const routeConfigs = Array.isArray(target.routeConfigurations) ? target.routeConfigurations : [];
        routeConfigs.push({
            path: options.path || '',
            middleware: options.middleware || [],
            method: options.method || ApiMethod.GET,
            handler: descriptor.value
        });
        target.routeConfigurations = routeConfigs;
    }

    private static response(res: Response, appResponse: BaseResponse, logger: LoggerService): void {
        RouteControllerMethodDecorator.logResponse(appResponse, logger);
        res.status(appResponse.status).json(appResponse);
    }

    private static logResponse(appResponse: BaseResponse, logger: LoggerService): void {
        const messageToLog = `[${appResponse.status}]: ${appResponse.data}`;
        if (appResponse.status < 400) {
            logger.logInfo(messageToLog);
        } else if (appResponse.status < 500) {
            logger.logWarn(messageToLog);
        } else {
            logger.logError(messageToLog);
        }
    }
}


export interface RouteControllerMethodOptions {
    method?: ApiMethod;
    path?: string;
    middleware?: RequestHandler[];
}

export default RouteControllerMethodDecorator.RouteControllerMethod;
