import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { MockFactory } from '../factories/mock.factory';
export declare class MockRouteInterceptor implements NestInterceptor {
    private readonly reflector;
    private readonly mockFactory;
    constructor(reflector: Reflector, mockFactory: MockFactory);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private randomInt;
}
