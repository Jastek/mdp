"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regexField = exports.formatSearch = void 0;
/**
 * Format the search input as a query in mongodb
 * @param search
 * @param columns
 */
function formatSearch(search = '', columns = []) {
    const object = {};
    if (search === '')
        return object;
    object.$or = columns.map((x) => {
        const col = {};
        // col[x] = { $regex: `.*${search}.*`, $options: 'i'};
        col[x] = regexField(search);
        return col;
    });
    return object;
}
exports.formatSearch = formatSearch;
function regexField(search) {
    return { $regex: `.*${search}.*`, $options: 'i' };
}
exports.regexField = regexField;
//# sourceMappingURL=format-search.js.map