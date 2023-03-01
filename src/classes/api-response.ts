

export class ApiResponse {
    success: boolean;
    data: any;
    count?: number;
    error?: any;

    constructor(success: boolean, data: any, count: number = null, error: string) {
        this.success = success;
        this.data = data;
        this.count = count;
        this.error = error;
    }

    static buildSuccess(data: any, count: number = null) {
        return new ApiResponse(true, data, count, null);
    }

    static buildError(error: any) {
        return new ApiResponse(false, null, null, error?.toString());
    }

}