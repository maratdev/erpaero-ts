import { ILogObj, Logger } from 'tslog';
import { ILogger } from './logger.interface';
import { injectable } from 'inversify';

@injectable()
export class LoggerService implements ILogger {
	public logger: Logger<ILogObj>;

	constructor() {
		this.logger = new Logger({
			type: 'pretty',
			prettyLogTimeZone: 'local',
			stylePrettyLogs: true,
			prettyLogTemplate: '{{dateIsoStr}} {{logLevelName}}: ',
			prettyLogStyles: {
				logLevelName: {
					'*': ['bold', 'blue'],
					INFO: ['green', 'blue'],
					WARN: ['bold', 'yellow'],
					ERROR: ['bold', 'red'],
					FATAL: ['bold', 'redBright'],
				},
			},
		});
	}

	log(...args: unknown[]): void {
		this.logger.info(...args);
	}

	error(...args: unknown[]): void {
		this.logger.error(...args);
	}

	warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}
}
