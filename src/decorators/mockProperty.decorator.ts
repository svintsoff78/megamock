import { MockPropertyOptions } from '../options/mockProperty.options';
import { MOCK_PROPERTIES_KEY } from '../constants/constants';

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
