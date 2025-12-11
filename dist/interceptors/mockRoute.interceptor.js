"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockRouteInterceptor = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rxjs_1 = require("rxjs");
const constants_1 = require("../constants/constants");
const mock_factory_1 = require("../factories/mock.factory");
let MockRouteInterceptor = class MockRouteInterceptor {
    constructor(reflector, mockFactory) {
        this.reflector = reflector;
        this.mockFactory = mockFactory;
    }
    intercept(context, next) {
        var _a;
        const handler = context.getHandler();
        const ctrl = context.getClass();
        const options = (_a = this.reflector.get(constants_1.MOCK_ROUTE_KEY, handler)) !== null && _a !== void 0 ? _a : this.reflector.get(constants_1.MOCK_ROUTE_KEY, ctrl);
        if (!options) {
            return next.handle();
        }
        const { entity, isArray, arrayLength } = options;
        if (isArray) {
            const [min = 1, max = 5] = arrayLength || [1, 5];
            const count = this.randomInt(min, max);
            const mock = this.mockFactory.createMany(entity, count);
            return (0, rxjs_1.of)(mock);
        }
        const mock = this.mockFactory.create(entity);
        return (0, rxjs_1.of)(mock);
    }
    randomInt(min, max) {
        const from = Math.ceil(min);
        const to = Math.floor(max);
        return Math.floor(Math.random() * (to - from + 1)) + from;
    }
};
exports.MockRouteInterceptor = MockRouteInterceptor;
exports.MockRouteInterceptor = MockRouteInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        mock_factory_1.MockFactory])
], MockRouteInterceptor);
//# sourceMappingURL=mockRoute.interceptor.js.map