"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockFactory = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants/constants");
const crypto_1 = require("crypto");
let MockFactory = class MockFactory {
    maxDepth = 3;
    create(entity, depth = 1) {
        const mockProps = Reflect.getMetadata(constants_1.MOCK_PROPERTIES_KEY, entity) || {};
        const result = {};
        for (const [key, options] of Object.entries(mockProps)) {
            result[key] = this.generateValue(options, depth);
        }
        return result;
    }
    createMany(entity, count, depth = 1) {
        return Array.from({ length: count }, () => this.create(entity, depth));
    }
    generateValue(options, depth) {
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
    generateByType(type, depth) {
        if (Array.isArray(type)) {
            return this.pickRandom(type);
        }
        if (typeof type === 'string') {
            return this.generatePrimitive(type);
        }
        if (typeof type === 'function') {
            if (depth >= this.maxDepth) {
                return null;
            }
            return this.create(type, depth + 1);
        }
        return null;
    }
    generatePrimitive(type) {
        switch (type) {
            case 'string':
                return this.randomString(10);
            case 'number':
                return this.randomInt(1, 1000);
            case 'boolean':
                return Math.random() < 0.5;
            case 'uuid':
                return (0, crypto_1.randomUUID)();
            case 'date':
                return new Date(Date.now() - this.randomInt(0, 1000 * 60 * 60 * 24 * 30)).toISOString();
            default:
                return null;
        }
    }
    randomInt(min, max) {
        const from = Math.ceil(min);
        const to = Math.floor(max);
        return Math.floor(Math.random() * (to - from + 1)) + from;
    }
    randomString(length) {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from({ length }, () => {
            const i = this.randomInt(0, chars.length - 1);
            return chars[i];
        }).join('');
    }
    pickRandom(list) {
        const idx = this.randomInt(0, list.length - 1);
        return list[idx];
    }
};
exports.MockFactory = MockFactory;
exports.MockFactory = MockFactory = __decorate([
    (0, common_1.Injectable)()
], MockFactory);
//# sourceMappingURL=mock.factory.js.map