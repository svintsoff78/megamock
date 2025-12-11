import { MockType } from '../types/mock.type';
/**
 * Configuration options for a property decorated with `@MockProperty`.
 *
 * These options describe how MegaMock should generate a value for the property
 * when creating a mock instance of the containing class.
 *
 * ## Fields
 * - `type`: The mock type to generate. This can be:
 *   - a scalar type (`'string'`, `'number'`, `'uuid'`, etc.)
 *   - a class constructor for nested mock objects
 * - `nullable`: If `true`, the generated value may randomly be `null`
 *   (default probability is ~30%).
 * - `isArray`: If `true`, the generated value will be an array of items
 *   instead of a single value.
 * - `arrayLength`: Tuple defining the `[min, max]` size of the array
 *   when `isArray` is enabled.
 *
 * ## Example
 * ```ts
 * class ChatMock {
 *   @MockProperty({ type: 'uuid' })
 *   id: string;
 *
 *   @MockProperty({ type: 'string', nullable: true })
 *   description?: string | null;
 *
 *   @MockProperty({ type: UserMock, isArray: true, arrayLength: [2, 5] })
 *   participants: UserMock[];
 * }
 * ```
 */
export interface MockPropertyOptions {
    type: MockType;
    nullable?: boolean;
    isArray?: boolean;
    arrayLength?: [number, number];
}
