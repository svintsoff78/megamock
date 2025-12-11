import {
  applyDecorators,
  SetMetadata,
  Type,
  UseInterceptors,
} from '@nestjs/common';
import { MockRouteOptions } from '../options/mockRoute.options';
import { MOCK_ROUTE_KEY } from '../constants/constants';
import { MockRouteInterceptor } from '../interceptors/mockRoute.interceptor';

export function MockRoute(
  entity: Type<any>,
  options: Omit<MockRouteOptions, 'entity'> = {},
): MethodDecorator {
  return applyDecorators(
    SetMetadata(MOCK_ROUTE_KEY, { entity, ...options }),
    UseInterceptors(MockRouteInterceptor),
  );
}