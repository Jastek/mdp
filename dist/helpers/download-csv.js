"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadCSV = void 0;
const json2csv_1 = require("json2csv");
const downloadCSV = (res, fileName, fields, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const json2csv = new json2csv_1.Parser({ fields });
        const csv = json2csv.parse(data);
        return csv;
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);
        throw err;
    }
});
exports.downloadCSV = downloadCSV;
//# sourceMappingURL=download-csv.js.map