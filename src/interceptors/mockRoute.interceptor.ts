import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { MOCK_ROUTE_KEY } from '../constants/constants';
import { MockRouteOptions } from '../options/mockRoute.options';
import { MockFactory } from '../factories/mock.factory';

@Injectable()
export class MockRouteInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly mockFactory: MockFactory,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handler = context.getHandler();
    const ctrl = context.getClass();

    const options =
      this.reflector.get<MockRouteOptions>(MOCK_ROUTE_KEY, handler) ??
      this.reflector.get<MockRouteOptions>(MOCK_ROUTE_KEY, ctrl);

    if (!options) {
      return next.handle();
    }

    const { entity, isArray, arrayLength } = options;

    if (isArray) {
      const [min = 1, max = 5] = arrayLength || [1, 5];
      const count = this.randomInt(min, max);
      const mock = this.mockFactory.createMany(entity as any, count);
      return of(mock);
    }

    const mock = this.mockFactory.create(entity as any);
    return of(mock);
  }

  private randomInt(min: number, max: number): number {
    const from = Math.ceil(min);
    const to = Math.floor(max);
    return Math.floor(Math.random() * (to - from + 1)) + from;
  }
}