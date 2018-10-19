import { Request, Response, NextFunction } from 'express';
import { NewUser } from '../../shared/models/user.model';
import { emailRegExp } from '../../shared/helpers';
import RouteController from '../../shared/decorators/controller/route-controller.decorator';
import RouteControllerMethod from '../../shared/decorators/controller/route-controller-method.decorator';
import { ApiMethod } from '../../shared/decorators/controller/api-methods.enum';
import { ClientError } from '../../shared/classes/errors/client-error.class';
import bcrypt from 'bcrypt';

@RouteController({
    basePath: '/auth',
    loggerContext: AuthController.loggerContext,
    childrenControllers: []
})
class AuthController {
    private static loggerContext = 'AUTH_CONTROLLER';

    @RouteControllerMethod({ method: ApiMethod.POST, })
    private postRegistrationHandler(req: Request, _res: Response, _next: NextFunction): Promise<string> {
        this.validateNewUser(req.body);

        return new Promise<string>((resolve, reject) => {
            bcrypt.hash(req.body.password, 10, function (err: Error, hash: string) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(hash);
            });
        });
    }

    private validateNewUser(newUser: NewUser): void {
        if (typeof newUser !== 'object') {
            throw new ClientError('Wrong Body');
        } else if (!newUser.email || !emailRegExp.test(newUser.email)) {
            throw new ClientError('Wrong Email');
        } else if (!newUser.password) {
            throw new ClientError('Wrong Password');
        } else if (!newUser.username) {
            throw new ClientError('Wrong Username');
        }
    }
}

export default new AuthController();
