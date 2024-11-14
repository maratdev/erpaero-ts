import {ILogObj, Logger} from 'tslog';

export class LoggerService {
    public logger: Logger<ILogObj>;

    constructor() {
        this.logger = new Logger({
            type: 'pretty',
            prettyLogTimeZone: 'local',
            stylePrettyLogs: true,
            prettyLogTemplate: "{{dateIsoStr}} {{logLevelName}}: ",
            prettyLogStyles: {
                logLevelName: {
                    "*": ["bold", "blue"],
                    INFO: ["green", "blue"],
                    WARN: ["bold", "yellow"],
                    ERROR: ["bold", "red"],
                    FATAL: ["bold", "redBright"],
                },
            }
        });
    }

    log(...args: unknown[]) {
        this.logger.info(...args);
    }

    error(...args: unknown[]) {
        this.logger.error(...args);
    }

    warn(...args: unknown[]) {
        this.logger.warn(...args);
    }
}