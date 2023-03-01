"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatOrder = void 0;
/**
 * Format the column and direction to be use in a mongodb query
 * @param column
 * @param direction
 * @returns
 */
function formatOrder(column, direction, aggregateFormat = false) {
    const obj = {};
    obj[column] = getDirection(direction, aggregateFormat);
    return obj;
}
exports.formatOrder = formatOrder;
function getDirection(direction, aggregateFormat = false) {
    if (aggregateFormat) {
        return direction === 'ASC' ? 1 : -1;
    }
    else {
        return direction;
    }
}
//# sourceMappingURL=format-order.js.map