import { configure, getLogger, Logger } from 'log4js';

export class LoggerService {
    public logger: Logger;

    constructor(context: string = 'app') {
        this.configureLogger(context);
        this.logger = getLogger(context);
    }

    public logInfo(logText: string): void {
        this.logger.info(logText);
    }

    public logWarn(logText: string): void {
        this.logger.warn(logText);
    }

    public logError(logText: string): void {
        this.logger.error(logText);
    }

    private configureLogger(context: string): void {
        const loggerAppender: LoggerAppender = {};
        loggerAppender[context] = { type: 'stdout' };

        configure({
            appenders: loggerAppender,
            categories: { default: { appenders: [context], level: 'info' } },
        });
    }
}

interface LoggerAppender {
    [key: string]: { type: string };
}
