import type { Type } from '@nestjs/common';
import { MockScalarType } from './mockScalar.type';
import { MockEnumType } from "./mockEnum.type";
export type MockType = MockScalarType | MockEnumType | Type<any>;
