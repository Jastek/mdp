"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    constructor(success, data, count = null, error) {
        this.success = success;
        this.data = data;
        this.count = count;
        this.error = error;
    }
    static buildSuccess(data, count = null) {
        return new ApiResponse(true, data, count, null);
    }
    static buildError(error) {
        return new ApiResponse(false, null, null, error === null || error === void 0 ? void 0 : error.toString());
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=api-response.js.map