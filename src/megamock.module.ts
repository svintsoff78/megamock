import { APP_INTERCEPTOR } from '@nestjs/core';
import { MockFactory } from './factories/mock.factory';
import { Global, Module } from '@nestjs/common';
import { MockRouteInterceptor } from './interceptors/mockRoute.interceptor';

@Global()
@Module({
  providers: [
    MockFactory,
    {
      provide: APP_INTERCEPTOR,
      useClass: MockRouteInterceptor,
    },
  ],
  exports: [MockFactory],
})
export class MegamockModule {}