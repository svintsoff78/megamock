import {
  applyDecorators,
  SetMetadata,
  Type,
  UseInterceptors,
} from '@nestjs/common';
import { MockRouteOptions } from '../options/mockRoute.options';
import { MOCK_ROUTE_KEY } from '../constants/constants';
import { MockRouteInterceptor } from '../interceptors/mockRoute.interceptor';

/**
 * Method decorator that enables automatic mock response generation
 * for a specific route handler.
 *
 * `@MockRoute` tells MegaMock to intercept the request and return
 * a generated mock object (or array of objects) based on the provided
 * entity class and mock options.
 *
 * ## How it works
 * - Stores route-level configuration under `MOCK_ROUTE_KEY` metadata.
 * - Automatically applies `MockRouteInterceptor` to the method.
 * - At runtime, the interceptor checks this metadata to decide whether
 *   to bypass the real route handler and return mock data instead.
 *
 * ## Example
 * ```ts
 * @Controller('chats')
 * export class ChatController {
 *
 *   // Return a list of ChatMock objects
 *   @Get()
 *   @MockRoute(ChatMock, { isArray: true, arrayLength: [3, 7] })
 *   getChats() {}
 *
 *   // Return a single ChatMock object
 *   @Get(':id')
 *   @MockRoute(ChatMock)
 *   getChatById() {}
 * }
 * ```
 *
 * ## Option behavior
 * - `entity`: The class used to generate mock data. All properties decorated
 *   with `@MockProperty` inside this class will be used by `MockFactory`.
 * - `isArray`: If `true`, the mock response will be an array of entities.
 * - `arrayLength`: A tuple `[min, max]` defining random list size.
 *
 * ## Internals
 * This decorator applies two things:
 *
 * 1. `SetMetadata(MOCK_ROUTE_KEY, {...})`
 *    — stores route configuration.
 *
 * 2. `UseInterceptors(MockRouteInterceptor)`
 *    — attaches the interceptor responsible for generating mock data.
 *
 * The real controller method will *not execute* if mock mode is active.
 *
 * @param entity The mock entity class defining the mockable structure.
 * @param options Optional configuration for array mode and array size.
 * @returns A NestJS method decorator that registers mock metadata
 *          and applies the mock route interceptor.
 */
export function MockRoute(
  entity: Type<any>,
  options: Omit<MockRouteOptions, 'entity'> = {},
): MethodDecorator {
  return applyDecorators(
    SetMetadata(MOCK_ROUTE_KEY, { entity, ...options }),
    UseInterceptors(MockRouteInterceptor),
  );
}