import RouteController from '../shared/decorators/controller/route-controller.decorator';
import authController from './api/auth.controller';

@RouteController({
    basePath: '/api',
    childrenControllers: [authController],
    loggerContext: ApiController.loggerContext,
})
class ApiController {
    public static loggerContext: string = 'API_CONTROLLER';
}

export default new ApiController();
