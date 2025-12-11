import { Type } from '@nestjs/common';
/**
 * Configuration options for the `@MockRoute` decorator.
 *
 * These options define how MegaMock should generate the mock response
 * for a specific controller method (or for the entire controller when
 * applied at the class level).
 *
 * ## Fields
 * - `entity`: The class used to generate mock objects. Every property
 *   inside this class that is decorated with `@MockProperty` will be
 *   included in the generated mock response.
 *
 * - `isArray`: If `true`, the route will return an array of mock entities
 *   instead of a single one.
 *
 * - `arrayLength`: A tuple `[min, max]` defining the randomly generated
 *   size of the array when `isArray` is enabled.
 *
 * ## Example
 * ```ts
 * @MockRoute(ChatMock)
 * @Get(':id')
 * getChat() {}
 *
 * @MockRoute(ChatMock, { isArray: true, arrayLength: [3, 7] })
 * @Get()
 * listChats() {}
 * ```
 *
 * ## Notes
 * These options are read by `MockRouteInterceptor`, which decides whether
 * to intercept the request and return mock data instead of executing the
 * actual controller method.
 */
export interface MockRouteOptions {
    entity: Type<any>;
    isArray?: boolean;
    arrayLength?: [number, number];
}
