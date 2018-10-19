import { configure, getLogger, Logger } from 'log4js';

export class LoggerService {
    public logger: Logger;

    constructor(context: string = 'app') {
        this.configureLogger(context);
        this.logger = getLogger(context);
    }

    public logInfo(logText: string): void {
        this.logger.info(this.formatMessage(logText));
    }

    public logWarn(logText: string): void {
        this.logger.warn(this.formatMessage(logText));
    }

    public logError(logText: string): void {
        this.logger.error(this.formatMessage(logText));
    }

    private formatMessage(text: string): string {
        return text;
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
