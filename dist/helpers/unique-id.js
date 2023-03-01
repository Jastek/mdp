"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genUniqueId = void 0;
function genUniqueId() {
    const dateStr = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `${dateStr}-${randomStr}`;
}
exports.genUniqueId = genUniqueId;
//# sourceMappingURL=unique-id.js.map