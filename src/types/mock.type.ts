import type {Type} from '@nestjs/common';
import {MockScalarType} from './mockScalar.type';
import {MockEnumType} from "./mockEnum.type";

/**
 * Describes the kind of mock value that MegaMock should generate for a property.
 *
 * `MockType` supports three kinds of mock definitions:
 *
 * ## 1. Scalar mock types (`MockScalarType`)
 * Basic primitive generators such as:
 * - `'string'`
 * - `'number'`
 * - `'boolean'`
 * - `'uuid'`
 * - `'date'`
 *
 * Example:
 * ```ts
 * @MockProperty({ type: 'uuid' })
 * id: string;
 * ```
 *
 * ## 2. Enum-like fixed value sets (`MockEnumType`)
 * When `type` is an array, MegaMock randomly selects **one value**
 * from this array. Values may be:
 * - string literals
 * - numbers
 * - booleans
 *
 * Example:
 * ```ts
 * @MockProperty({ type: ['draft', 'published', 'archived'] })
 * status: string;
 * ```
 *
 * This enables enum-mocking behavior without requiring a TypeScript enum.
 *
 *
 * ## 3. Nested entity constructors (`Type<any>`)
 * When the type is a class constructor, MegaMock recursively generates
 * a nested mock object using all `@MockProperty` definitions inside that class.
 *
 * Example:
 * ```ts
 * @MockProperty({ type: UserMock })
 * author: UserMock;
 * ```
 *
 * This allows structured, deeply nested mock generation while preventing
 * infinite loops via depth limiting.
 *
 *
 * ## Summary
 * `MockType` gives MegaMock the flexibility to generate:
 * - primitive values
 * - enum-like constrained values
 * - fully nested mock entity graphs
 *
 * This union type is the core of MegaMock's declarative mock system.
 */
export type MockType = MockScalarType | MockEnumType | Type<any>;