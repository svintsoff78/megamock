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
/**
 * Core factory responsible for generating mock objects for MegaMock.
 *
 * `MockFactory` reads metadata produced by the `@MockProperty` decorator
 * and uses it to build mock instances of a given entity class.
 *
 * ## Responsibilities
 * - Read `MockPropertyOptions` for a class from `MOCK_PROPERTIES_KEY`.
 * - Generate values for each mockable property:
 *   - primitive scalar types (`string`, `number`, `boolean`, etc.)
 *   - nested entities (class constructors)
 *   - arrays of values or entities
 *   - nullable fields with random nulls
 * - Prevent infinite recursion for cyclic nested structures using `maxDepth`.
 *
 * This factory is used both by `MockRouteInterceptor` (for HTTP/WebSocket mocks)
 * and can be injected directly into application code or tests if needed.
 */
let MockFactory = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var MockFactory = _classThis = class {
        constructor() {
            /**
             * Maximum recursion depth when generating nested entities.
             *
             * Once this depth is reached, nested entity fields will resolve to `null`
             * instead of going deeper, which protects against circular references like:
             * `UserMock -> ChatMock -> UserMock -> ...`
             */
            this.maxDepth = 3;
        }
        /**
         * Creates a single mock instance for the given entity class.
         *
         * The method:
         * - reads all `MockPropertyOptions` stored on the entity constructor
         * - generates per-property values with `generateValue`
         * - returns a plain object casted to the target type
         *
         * @typeParam T - Target entity type.
         * @param entity Class constructor annotated with `@MockProperty` on its fields.
         * @param depth Current recursion depth (used internally for nested entities).
         * @returns A mock instance of the given entity.
         */
        create(entity, depth = 1) {
            const mockProps = Reflect.getMetadata(constants_1.MOCK_PROPERTIES_KEY, entity) || {};
            const result = {};
            for (const [key, options] of Object.entries(mockProps)) {
                result[key] = this.generateValue(options, depth);
            }
            return result;
        }
        /**
         * Creates an array of mock instances for the given entity class.
         *
         * This is a convenience wrapper over {@link MockFactory.create} that
         * simply calls it `count` times and collects the results.
         *
         * @typeParam T - Target entity type.
         * @param entity Class constructor annotated with `@MockProperty` on its fields.
         * @param count Number of mock instances to generate.
         * @param depth Current recursion depth (propagated to child calls).
         * @returns An array of mock instances.
         */
        createMany(entity, count, depth = 1) {
            return Array.from({ length: count }, () => this.create(entity, depth));
        }
        /**
         * Generates a value for a single property based on its mock options.
         *
         * - If `nullable` is enabled, returns `null` with some probability.
         * - If `isArray` is enabled, generates an array of values using `arrayLength`.
         * - Otherwise, delegates to {@link MockFactory.generateByType}.
         *
         * @param options Mock configuration for the property.
         * @param depth Current recursion depth.
         * @returns Generated mock value for the property.
         * @internal
         */
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
        /**
         * Resolves a mock value based on the logical mock type definition.
         *
         * `generateByType` is the central dispatcher for interpreting a property's
         * declared `MockType`. It determines whether the mock value should be:
         *
         * 1. **A fixed enum-like value**
         *    If `type` is an array (`MockEnumType`), one of the values is selected
         *    randomly using {@link pickRandom}.
         *
         * 2. **A generated primitive**
         *    If `type` is a scalar identifier (`MockScalarType`, e.g. `'string'`),
         *    a corresponding primitive mock value is produced via
         *    {@link generatePrimitive}.
         *
         * 3. **A nested mock object**
         *    If `type` is a class constructor, MegaMock treats it as a nested
         *    entity and recursively calls {@link create}.
         *    Depth is limited by {@link maxDepth} to avoid infinite recursion
         *    in cyclic structures.
         *
         * If none of the supported patterns match, the function returns `null`.
         *
         * ## Example resolution flow
         * ```ts
         * // Enum type:
         * type: ['draft', 'published']
         * → one of ["draft", "published"]
         *
         * // Primitive type:
         * type: 'uuid'
         * → "d4e73d72-..."
         *
         * // Nested type:
         * type: UserMock
         * → { id: "...", name: "...", ... }
         * ```
         *
         * @param type Logical mock type describing how the value should be generated.
         * @param depth Current recursion depth for nested entity creation.
         * @returns Generated mock value of the appropriate type, or `null` if unsupported.
         * @internal
         */
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
        /**
         * Generates a primitive mock value for the given scalar type.
         *
         * This is the default implementation for simple types and can be
         * extended or replaced in future versions (for example, using Faker).
         *
         * @param type Logical scalar mock type to generate.
         * @returns A randomly generated primitive matching the requested type.
         * @internal
         */
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
        /**
         * Returns a random integer between `min` and `max` (inclusive).
         *
         * Used internally for number generation and random array lengths.
         *
         * @param min Minimum value (inclusive).
         * @param max Maximum value (inclusive).
         * @returns Random integer within the range.
         * @internal
         */
        randomInt(min, max) {
            const from = Math.ceil(min);
            const to = Math.floor(max);
            return Math.floor(Math.random() * (to - from + 1)) + from;
        }
        /**
         * Generates a random alphanumeric string of the given length.
         *
         * Used as a base implementation for `'string'` mock type.
         *
         * @param length Target string length.
         * @returns Random string consisting of lowercase letters and digits.
         * @internal
         */
        randomString(length) {
            const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
            return Array.from({ length }, () => {
                const i = this.randomInt(0, chars.length - 1);
                return chars[i];
            }).join('');
        }
        /**
         * Returns a random element from the provided list.
         *
         * Used internally by MegaMock when a property defines its type
         * as a fixed-value array (`MockEnumType`). This enables enum-like
         * mock generation, where the produced value must be one of the
         * explicitly allowed literals.
         *
         * ## Example
         * ```ts
         * pickRandom(['draft', 'published', 'archived']);
         * // → "published" (random)
         * ```
         *
         * @typeParam T The literal type of the list elements.
         * @param list A readonly array of allowed values.
         * @returns A randomly selected element from the array.
         * @internal
         */
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