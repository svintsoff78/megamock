import { Type } from '@nestjs/common';

export interface MockRouteOptions {
  entity: Type<any>;
  isArray?: boolean;
  arrayLength?: [number, number];
}