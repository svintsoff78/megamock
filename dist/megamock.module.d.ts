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
export declare class MegamockModule {
}
