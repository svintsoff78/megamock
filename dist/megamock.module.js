"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MegamockModule = void 0;
const core_1 = require("@nestjs/core");
const mock_factory_1 = require("./factories/mock.factory");
const common_1 = require("@nestjs/common");
const mockRoute_interceptor_1 = require("./interceptors/mockRoute.interceptor");
let MegamockModule = class MegamockModule {
};
exports.MegamockModule = MegamockModule;
exports.MegamockModule = MegamockModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            mock_factory_1.MockFactory,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: mockRoute_interceptor_1.MockRouteInterceptor,
            },
        ],
        exports: [mock_factory_1.MockFactory],
    })
], MegamockModule);
//# sourceMappingURL=megamock.module.js.map