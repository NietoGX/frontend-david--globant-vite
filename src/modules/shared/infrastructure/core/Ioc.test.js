import { describe, it, expect, beforeEach } from 'vitest';
import { Ioc } from './Ioc';

describe('Ioc Container', () => {
    beforeEach(() => {
        Ioc.instance.reset();
    });

    it('should register and retrieve a singleton', () => {
        const key = 'test-key';
        const value = { data: 'test-value' };

        Ioc.instance.singleton(key, () => value);

        const retrieved = Ioc.instance.provideByKey(key);
        expect(retrieved).toBe(value);
    });

    it('should return the same instance for singleton', () => {
        const key = 'singleton-key';

        Ioc.instance.singleton(key, () => ({ random: Math.random() }));

        const instance1 = Ioc.instance.provideByKey(key);
        const instance2 = Ioc.instance.provideByKey(key);

        expect(instance1).toBe(instance2);
    });

    it('should throw error if key not registered', () => {
        expect(() => {
            Ioc.instance.provideByKey('non-existent');
        }).toThrow('No singleton registered for key non-existent');
    });

    it('should throw error if duplicate key registered', () => {
        const key = 'duplicate-key';
        Ioc.instance.singleton(key, () => 'value');

        expect(() => {
            Ioc.instance.singleton(key, () => 'other');
        }).toThrow(`Singleton already registered for key ${key}`);
    });

    it('should support overrides', () => {
        const key = 'override-key';
        const original = 'original';
        const overridden = 'overridden';

        Ioc.instance.singleton(key, () => original);
        Ioc.instance.override({ [key]: () => overridden });

        expect(Ioc.instance.provideByKey(key)).toBe(overridden);
    });
});
