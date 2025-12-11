import { Type } from '@nestjs/common';
import { MockRouteOptions } from '../options/mockRoute.options';
export declare function MockRoute(entity: Type<any>, options?: Omit<MockRouteOptions, 'entity'>): MethodDecorator;
