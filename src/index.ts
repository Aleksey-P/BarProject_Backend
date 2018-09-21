import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { createServer, Server } from 'http';
import { LoggerService } from './services/logger.service';
import { Application } from 'express';
import { APP_CONFIG } from './config/app.config';

class App {
    private static loggerContext = 'APP';
    private static logger = new LoggerService(App.loggerContext);
    private static express: Application = express();
    private static expressServer: Server

    public static startApplication(): void {
        App.express.use(bodyParser.json());
        App.express.use(bodyParser.urlencoded({ extended: false }));
        App.express.use(helmet());
        App.express.use(cors());

        App.logger.logInfo('Starting HTTP server...');
        App.expressServer = createServer(App.express);
        App.expressServer.on('error', (err: Error) => {
            App.logger.logError(err.message);
        });
        const serverPort = APP_CONFIG.PORT;
        App.expressServer.listen(serverPort, () => {
            App.logger.logInfo(`Listening on port ${serverPort}`);
        });

        process.title = 'Currency Exchanger';
        process.on('SIGTERM', App.closeServer);
        process.on('SIGINT',  App.closeServer);
        process.on('unhandledRejection', (error) => {
            App.logger.logError(error.message);
        });
    }

    private static closeServer(): void {
        App.logger.logInfo('Closing HTTP server...');
        App.expressServer.close(() => {
            App.logger.logInfo('HTTP server closed');
        });
    }
}
App.startApplication();
