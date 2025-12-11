import { MockType } from '../types/mock.type';
export interface MockPropertyOptions {
    type: MockType;
    nullable?: boolean;
    isArray?: boolean;
    arrayLength?: [number, number];
}
