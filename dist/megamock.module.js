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
exports.MegamockModule = void 0;
const core_1 = require("@nestjs/core");
const mock_factory_1 = require("./factories/mock.factory");
const common_1 = require("@nestjs/common");
const mockRoute_interceptor_1 = require("./interceptors/mockRoute.interceptor");
/**
 * Global NestJS module that integrates MegaMock into the application.
 *
 * `MegamockModule` registers:
 * - {@link MockFactory} — the core service responsible for generating mock data.
 * - {@link MockRouteInterceptor} — a global interceptor that intercepts routes
 *   decorated with `@MockRoute` and returns mock responses instead of executing
 *   the actual controller logic.
 *
 * ## Why global?
 * The module is marked as `@Global()` so that:
 * - `MockFactory` is available application-wide without needing to import
 *   the module repeatedly in feature modules.
 * - `MockRouteInterceptor` is automatically applied everywhere — it only
 *   activates on routes that have `@MockRoute` metadata.
 *
 * ## Usage
 * Import it once in the root module:
 *
 * ```ts
 * @Module({
 *   imports: [MegamockModule],
 * })
 * export class AppModule {}
 * ```
 *
 * After that:
 * - `@MockProperty` and `@MockRoute` decorators become fully operational.
 * - Any route annotated with `@MockRoute` will return mock data.
 *
 * ## Exports
 * - `MockFactory` is exported so it can be injected manually if needed
 *   (e.g., in tests or custom mock pipelines).
 */
let MegamockModule = (() => {
    let _classDecorators = [(0, common_1.Global)(), (0, common_1.Module)({
            providers: [
                mock_factory_1.MockFactory,
                {
                    provide: core_1.APP_INTERCEPTOR,
                    useClass: mockRoute_interceptor_1.MockRouteInterceptor,
                },
            ],
            exports: [mock_factory_1.MockFactory],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var MegamockModule = _classThis = class {
    };
    __setFunctionName(_classThis, "MegamockModule");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MegamockModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MegamockModule = _classThis;
})();
exports.MegamockModule = MegamockModule;
//# sourceMappingURL=megamock.module.js.map