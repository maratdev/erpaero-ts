export class HttpError extends Error {
    statusCode: number;
    ctx?: string;

    constructor(statusCode: number, message: string, ctx?: string) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.ctx = ctx;
    }
}