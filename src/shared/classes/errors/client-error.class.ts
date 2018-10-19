export class ClientError extends Error {
    constructor(message: string = 'Client Error') {
        super(message);
    }
}
