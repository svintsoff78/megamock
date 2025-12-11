import type { Type } from '@nestjs/common';
import { MockScalarType } from './mockScalar.type';

export type MockType = MockScalarType | Type<any>;