/**
 * Metadata key used to store mock property definitions for a class.
 *
 * MegaMock attaches a map of `MockPropertyOptions` to this metadata key
 * on the target class. Each entry represents a property decorated with
 * `@MockProperty`, describing how its value should be generated.
 *
 * This metadata is read by `MockFactory` to produce mock objects,
 * and is completely independent of ORM or validation decorators.
 *
 * @internal
 */
export const MOCK_PROPERTIES_KEY = 'mock:properties';

/**
 * Metadata key used to store mock route configuration for a controller method.
 *
 * When a handler or controller is decorated with `@MockRoute`, MegaMock
 * stores route-level options (entity type, array mode, array length, etc)
 * under this key. `MockRouteInterceptor` reads this metadata at runtime
 * to decide whether to intercept the request and return mock data instead
 * of executing the actual route handler.
 *
 * This metadata allows MegaMock to seamlessly integrate into the NestJS
 * request pipeline using decorators and interceptors.
 *
 * @internal
 */
export const MOCK_ROUTE_KEY = 'mock:route';