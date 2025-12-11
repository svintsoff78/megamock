import { Injectable } from '@nestjs/common';
import { MOCK_PROPERTIES_KEY } from '../constants/constants';
import { MockPropertyOptions } from '../options/mockProperty.options';
import { MockType } from '../types/mock.type';
import { MockScalarType } from '../types/mockScalar.type';
import { randomUUID } from 'crypto';

@Injectable()
export class MockFactory {
  private readonly maxDepth = 3;

  create<T>(entity: new () => T, depth = 1): T {
    const mockProps: Record<string, MockPropertyOptions> =
      Reflect.getMetadata(MOCK_PROPERTIES_KEY, entity) || {};

    const result: any = {};

    for (const [key, options] of Object.entries(mockProps)) {
      result[key] = this.generateValue(options, depth);
    }

    return result as T;
  }

  createMany<T>(entity: new () => T, count: number, depth = 1): T[] {
    return Array.from({ length: count }, () => this.create(entity, depth));
  }

  private generateValue(options: MockPropertyOptions, depth: number): any {
    const { type, nullable, isArray, arrayLength } = options;

    if (nullable && Math.random() < 0.3) {
      return null;
    }

    if (isArray) {
      const [min = 1, max = 5] = arrayLength || [1, 5];
      const length = this.randomInt(min, max);
      return Array.from({ length }, () => this.generateByType(type, depth));
    }

    return this.generateByType(type, depth);
  }

  private generateByType(type: MockType, depth: number): any {
    if (typeof type === 'string') {
      return this.generatePrimitive(type);
    }

    if (typeof type === 'function') {
      if (depth >= this.maxDepth) {
        return null;
      }
      return this.create(type as any, depth + 1);
    }

    return null;
  }

  private generatePrimitive(type: MockScalarType): any {
    switch (type) {
      case 'string':
        return this.randomString(10);
      case 'number':
        return this.randomInt(1, 1000);
      case 'boolean':
        return Math.random() < 0.5;
      case 'uuid':
        return randomUUID();
      case 'title':
        return `Chat #${this.randomInt(1, 9999)}`;
      case 'description':
        return `Random description ${this.randomInt(1, 999999)}`;
      case 'date':
        return new Date(
          Date.now() - this.randomInt(0, 1000 * 60 * 60 * 24 * 30),
        ).toISOString();
      default:
        return null;
    }
  }

  private randomInt(min: number, max: number): number {
    const from = Math.ceil(min);
    const to = Math.floor(max);
    return Math.floor(Math.random() * (to - from + 1)) + from;
  }

  private randomString(length: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => {
      const i = this.randomInt(0, chars.length - 1);
      return chars[i];
    }).join('');
  }
}