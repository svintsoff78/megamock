"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockRoute = MockRoute;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants/constants");
const mockRoute_interceptor_1 = require("../interceptors/mockRoute.interceptor");
function MockRoute(entity, options = {}) {
    return (0, common_1.applyDecorators)((0, common_1.SetMetadata)(constants_1.MOCK_ROUTE_KEY, { entity, ...options }), (0, common_1.UseInterceptors)(mockRoute_interceptor_1.MockRouteInterceptor));
}
//# sourceMappingURL=mockRoute.decorator.js.map