"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayDifference = void 0;
function arrayDifference(A, B) {
    const arrA = Array.isArray(A) ? A.map(x => x.toString()) : [A.toString()];
    const arrB = Array.isArray(B) ? B.map(x => x.toString()) : [B.toString()];
    const result = [];
    for (const p of arrA) {
        if (arrB.indexOf(p) === -1) {
            result.push(p);
        }
    }
    return result;
}
exports.arrayDifference = arrayDifference;
//# sourceMappingURL=array-difference.js.map