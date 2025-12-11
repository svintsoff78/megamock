import type { Type } from '@nestjs/common';
import { MockScalarType } from './mockScalar.type';

/**
 * Logical type describing what kind of mock value should be generated.
 *
 * `MockType` can represent:
 *
 * - A **scalar mock type** (`MockScalarType`), such as `'string'`,
 *   `'number'`, `'boolean'`, `'uuid'`, etc.
 * - A **class constructor** (`Type<any>`), representing a nested mockable
 *   entity. In this case, MegaMock recursively generates mock objects using
 *   the `MockFactory` and the `@MockProperty` annotations defined on the class.
 *
 * ## Examples
 *
 * ### Scalar type
 * ```ts
 * @MockProperty({ type: 'string' })
 * name: string;
 * ```
 *
 * ### Nested entity
 * ```ts
 * @MockProperty({ type: UserMock })
 * author: UserMock;
 * ```
 *
 * ### Nested array
 * ```ts
 * @MockProperty({ type: UserMock, isArray: true })
 * participants: UserMock[];
 * ```
 *
 * This union type enables MegaMock to support both primitive and structured
 * mock generation in a clean and declarative way.
 */
export type MockType = MockScalarType | Type<any>;