export class ServerError extends Error {
    constructor(message: string = 'Server Error') {
        super(message);
    }
}
