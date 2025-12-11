import { Injectable } from '@nestjs/common';
import { MOCK_PROPERTIES_KEY } from '../constants/constants';
import { MockPropertyOptions } from '../options/mockProperty.options';
import { MockType } from '../types/mock.type';
import { MockScalarType } from '../types/mockScalar.type';
import { randomUUID } from 'crypto';

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
@Injectable()
export class MockFactory {
    /**
     * Maximum recursion depth when generating nested entities.
     *
     * Once this depth is reached, nested entity fields will resolve to `null`
     * instead of going deeper, which protects against circular references like:
     * `UserMock -> ChatMock -> UserMock -> ...`
     */
  private readonly maxDepth = 3;

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
  create<T>(entity: new () => T, depth = 1): T {
    const mockProps: Record<string, MockPropertyOptions> =
      Reflect.getMetadata(MOCK_PROPERTIES_KEY, entity) || {};

    const result: any = {};

    for (const [key, options] of Object.entries(mockProps)) {
      result[key] = this.generateValue(options, depth);
    }

    return result as T;
  }

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
  createMany<T>(entity: new () => T, count: number, depth = 1): T[] {
    return Array.from({ length: count }, () => this.create(entity, depth));
  }

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
  private generateValue(options: MockPropertyOptions, depth: number): any {
    const { type, nullable, isArray, arrayLength } = options;

    if (nullable && Math.random() < 0.3) {
      return null;
    }

    if (isArray) {
      const [min = 1, max = 5] = arrayLength || [1, 5];
      const length = this.randomInt(min, max);
      return Array.from({ length }, () => this.generateByType(type, depth));
    }

    return this.generateByType(type, depth);
  }

    /**
     * Resolves a value based on the configured mock type.
     *
     * - For string-based types ({@link MockScalarType}) it uses
     *   {@link MockFactory.generatePrimitive}.
     * - For function types it treats them as class constructors and recursively
     *   calls {@link MockFactory.create} to build nested entities.
     *
     * Recursion is capped by {@link MockFactory.maxDepth} to avoid infinite loops.
     *
     * @param type Logical mock type (scalar type or constructor).
     * @param depth Current recursion depth.
     * @returns Generated primitive or nested entity, or `null` on depth limit.
     * @internal
     */
  private generateByType(type: MockType, depth: number): any {
    if (typeof type === 'string') {
      return this.generatePrimitive(type);
    }

    if (typeof type === 'function') {
      if (depth >= this.maxDepth) {
        return null;
      }
      return this.create(type as any, depth + 1);
    }

    return null;
  }

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
  private generatePrimitive(type: MockScalarType): any {
    switch (type) {
      case 'string':
        return this.randomString(10);
      case 'number':
        return this.randomInt(1, 1000);
      case 'boolean':
        return Math.random() < 0.5;
      case 'uuid':
        return randomUUID();
      case 'date':
        return new Date(
          Date.now() - this.randomInt(0, 1000 * 60 * 60 * 24 * 30),
        ).toISOString();
      default:
        return null;
    }
  }

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
  private randomInt(min: number, max: number): number {
    const from = Math.ceil(min);
    const to = Math.floor(max);
    return Math.floor(Math.random() * (to - from + 1)) + from;
  }

    /**
     * Generates a random alphanumeric string of the given length.
     *
     * Used as a base implementation for `'string'` mock type.
     *
     * @param length Target string length.
     * @returns Random string consisting of lowercase letters and digits.
     * @internal
     */
  private randomString(length: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => {
      const i = this.randomInt(0, chars.length - 1);
      return chars[i];
    }).join('');
  }
}