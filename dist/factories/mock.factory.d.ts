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
export declare class MockFactory {
    /**
     * Maximum recursion depth when generating nested entities.
     *
     * Once this depth is reached, nested entity fields will resolve to `null`
     * instead of going deeper, which protects against circular references like:
     * `UserMock -> ChatMock -> UserMock -> ...`
     */
    private readonly maxDepth;
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
    create<T>(entity: new () => T, depth?: number): T;
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
    createMany<T>(entity: new () => T, count: number, depth?: number): T[];
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
    private generateValue;
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
    private generateByType;
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
    private generatePrimitive;
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
    private randomInt;
    /**
     * Generates a random alphanumeric string of the given length.
     *
     * Used as a base implementation for `'string'` mock type.
     *
     * @param length Target string length.
     * @returns Random string consisting of lowercase letters and digits.
     * @internal
     */
    private randomString;
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
    private pickRandom;
}
