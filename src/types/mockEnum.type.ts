/**
 * Represents a fixed set of allowed mock values.
 *
 * `MockEnumType` enables enum-like behavior for `@MockProperty`:
 * when the `type` field is an array, MegaMock will randomly choose
 * **one value from this array** instead of generating a primitive
 * or nested object.
 *
 * Supported literal types:
 * - `string`
 * - `number`
 * - `boolean`
 *
 * ## Examples
 *
 * ### String enum values
 * ```ts
 * @MockProperty({ type: ['draft', 'published', 'archived'] })
 * status: string;
 * ```
 *
 * ### Numeric enum values
 * ```ts
 * @MockProperty({ type: [1, 5, 10] })
 * priority: number;
 * ```
 *
 * ### Mixed literal values
 * ```ts
 * @MockProperty({ type: ['auto', true, 42] })
 * mode: string | boolean | number;
 * ```
 *
 * ## How MegaMock uses it
 * The `MockFactory` checks if the provided `type` is an array.
 * If so, it selects a random element using `pickRandom()`,
 * ensuring mock values always match the allowed set.
 *
 * This is useful for:
 * - enum-like fields
 * - statuses
 * - roles
 * - predefined categories
 * - controlled random behavior in tests
 */
export type MockEnumType = readonly (string | number | boolean)[];