/**
 * Set of primitive scalar mock types supported by MegaMock.
 *
 * These values instruct the `MockFactory` to generate simple
 * non-nested mock data using built-in generators.
 *
 * ## Supported types
 * - `'string'` — Random alphanumeric string.
 * - `'number'` — Random integer within a default range.
 * - `'boolean'` — Random boolean (`true` or `false`).
 * - `'uuid'` — Random UUID (v4).
 * - `'date'` — Random ISO date string within a recent time window.
 *
 * ## Example
 * ```ts
 * @MockProperty({ type: 'uuid' })
 * id: string;
 *
 * @MockProperty({ type: 'boolean', nullable: true })
 * isActive?: boolean | null;
 * ```
 *
 * These scalar types represent the simplest mock generation paths.
 * For more complex structures, use nested classes via `MockType`.
 */
export type MockScalarType = 'string' | 'number' | 'boolean' | 'uuid' | 'date';
