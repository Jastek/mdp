"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlatform = exports.platformList = void 0;
exports.platformList = [
    { id: "1", label: 'LinkedIn' },
    { id: "2", label: 'Pluralsight' },
    { id: "3", label: 'Coursera' },
    { id: "4", label: 'EDX' },
    { id: "5", label: 'Udemy' },
    { id: "6", label: 'LinkedIn' },
    { id: "7", label: 'Capacitación interna' },
    { id: "8", label: 'Otro' }
];
function getPlatform(platformNumber) {
    var _a;
    return (_a = exports.platformList.find((x) => x.id === platformNumber)) === null || _a === void 0 ? void 0 : _a.label;
}
exports.getPlatform = getPlatform;
//# sourceMappingURL=platform-list.js.map