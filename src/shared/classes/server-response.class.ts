export abstract class BaseResponse {
    public status: number;
    public data: any;

    constructor(status: number, data: any) {
        this.status = status;
        this.data = data;
    }
}

export class SuccessResponse extends BaseResponse {
    constructor(data: any) {
        super(200, data);
    }
}

export class ClientErrorResponse extends BaseResponse {
    constructor(data: any) {
        super(400, data);
    }
}

export class ServerErrorResponse extends BaseResponse {
    constructor(data: any) {
        super(500, data);
    }
}
