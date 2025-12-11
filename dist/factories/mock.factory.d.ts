export declare class MockFactory {
    private readonly maxDepth;
    create<T>(entity: new () => T, depth?: number): T;
    createMany<T>(entity: new () => T, count: number, depth?: number): T[];
    private generateValue;
    private generateByType;
    private generatePrimitive;
    private randomInt;
    private randomString;
}
