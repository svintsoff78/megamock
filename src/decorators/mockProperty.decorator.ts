import { MockPropertyOptions } from '../options/mockProperty.options';
import { MOCK_PROPERTIES_KEY } from '../constants/constants';

/**
 * Decorator used to mark a class property as a mockable field.
 *
 * MegaMock reads all properties decorated with `@MockProperty` and uses the
 * provided {@link MockPropertyOptions} to generate mock data for that field.
 *
 * ## How it works
 * - Metadata is stored on the class constructor under the `MOCK_PROPERTIES_KEY`.
 * - Each decorated property is added to this metadata map.
 * - `MockFactory` later reads this metadata and generates corresponding values.
 *
 * This decorator does *not* modify the real TypeScript type,
 * it only provides metadata for mock generation.
 *
 * ## Example
 * ```ts
 * export class UserMock {
 *   @MockProperty({ type: 'id' })
 *   id: number;
 *
 *   @MockProperty({ type: 'string', nullable: true })
 *   nickname?: string | null;
 *
 *   @MockProperty({ type: AddressMock, isArray: true, arrayLength: [1, 3] })
 *   addresses: AddressMock[];
 * }
 * ```
 *
 * After applying `MockProperty` to these fields, MegaMock will automatically
 * generate mock values based on:
 * - primitive generators (`string`, `number`, `uuid`, etc.)
 * - nested entity constructors (e.g., `AddressMock`)
 * - array generation (if configured)
 * - nullability rules
 *
 * ## Internals
 * The decorator collects all properties in a metadata object:
 *
 * ```ts
 * {
 *   id: { type: 'id' },
 *   nickname: { type: 'string', nullable: true },
 *   addresses: { type: AddressMock, isArray: true }
 * }
 * ```
 *
 * This metadata is later consumed by `MockFactory` to produce mock DTOs.
 *
 * @param options Configuration describing how the property should be mocked.
 * @returns A property decorator registering metadata for mock generation.
 */
export function MockProperty(options: MockPropertyOptions): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    const ctor = target.constructor;
    const existing: Record<string, MockPropertyOptions> =
      Reflect.getMetadata(MOCK_PROPERTIES_KEY, ctor) || {};

    Reflect.defineMetadata(
      MOCK_PROPERTIES_KEY,
      {
        ...existing,
        [propertyKey as string]: options,
      },
      ctor,
    );
  };
}
