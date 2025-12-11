"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockFactory = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants/constants");
const crypto_1 = require("crypto");
let MockFactory = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var MockFactory = _classThis = class {
        constructor() {
            this.maxDepth = 3;
        }
        create(entity, depth = 1) {
            const mockProps = Reflect.getMetadata(constants_1.MOCK_PROPERTIES_KEY, entity) || {};
            const result = {};
            for (const [key, options] of Object.entries(mockProps)) {
                result[key] = this.generateValue(options, depth);
            }
            return result;
        }
        createMany(entity, count, depth = 1) {
            return Array.from({ length: count }, () => this.create(entity, depth));
        }
        generateValue(options, depth) {
            const { type, nullable, isArray, arrayLength } = options;
            if (nullable && Math.random() < 0.3) {
                return null;
            }
            if (isArray) {
                const [min = 1, max = 5] = arrayLength || [1, 5];
                const length = this.randomInt(min, max);
                return Array.from({ length }, () => this.generateByType(type, depth));
            }
            return this.generateByType(type, depth);
        }
        generateByType(type, depth) {
            if (Array.isArray(type)) {
                return this.pickRandom(type);
            }
            if (typeof type === 'string') {
                return this.generatePrimitive(type);
            }
            if (typeof type === 'function') {
                if (depth >= this.maxDepth) {
                    return null;
                }
                return this.create(type, depth + 1);
            }
            return null;
        }
        generatePrimitive(type) {
            switch (type) {
                case 'string':
                    return this.randomString(10);
                case 'number':
                    return this.randomInt(1, 1000);
                case 'boolean':
                    return Math.random() < 0.5;
                case 'uuid':
                    return (0, crypto_1.randomUUID)();
                case 'date':
                    return new Date(Date.now() - this.randomInt(0, 1000 * 60 * 60 * 24 * 30)).toISOString();
                default:
                    return null;
            }
        }
        randomInt(min, max) {
            const from = Math.ceil(min);
            const to = Math.floor(max);
            return Math.floor(Math.random() * (to - from + 1)) + from;
        }
        randomString(length) {
            const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
            return Array.from({ length }, () => {
                const i = this.randomInt(0, chars.length - 1);
                return chars[i];
            }).join('');
        }
        pickRandom(list) {
            const idx = this.randomInt(0, list.length - 1);
            return list[idx];
        }
    };
    __setFunctionName(_classThis, "MockFactory");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MockFactory = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MockFactory = _classThis;
})();
exports.MockFactory = MockFactory;
//# sourceMappingURL=mock.factory.js.map