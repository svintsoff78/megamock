"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockProperty = MockProperty;
const constants_1 = require("../constants/constants");
function MockProperty(options) {
    return (target, propertyKey) => {
        const ctor = target.constructor;
        const existing = Reflect.getMetadata(constants_1.MOCK_PROPERTIES_KEY, ctor) || {};
        Reflect.defineMetadata(constants_1.MOCK_PROPERTIES_KEY, {
            ...existing,
            [propertyKey]: options,
        }, ctor);
    };
}
//# sourceMappingURL=mockProperty.decorator.js.map