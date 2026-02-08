export class Ioc {
    constructor() {
        this.singletons = new Map();
        this.overrides = new Map();
        this.builtInstances = new Map();
        if (!Ioc.instance) {
            Ioc.instance = this;
        }
    }

    static instance = new Ioc();

    singleton(key, factory) {
        if (this.singletons.has(key)) {
            throw new Error(`Singleton already registered for key ${key}`);
        }
        this.singletons.set(key, factory);
        return this;
    }

    override(override) {
        Object.entries(override).forEach(([key, value]) => {
            this.overrides.set(key, value);
        });
        return this;
    }

    reset() {
        this.builtInstances = new Map();
        this.overrides = new Map();
        this.singletons = new Map();
    }

    provideByKey(key) {
        if (this.builtInstances.has(key)) {
            return this.builtInstances.get(key);
        }
        const factory = this.overrides.has(key) ? this.overrides.get(key) : this.singletons.get(key);
        if (factory == null) {
            throw new Error(`No singleton registered for key ${key}`);
        }
        const builtInstance = factory();
        this.builtInstances.set(key, builtInstance);
        return builtInstance;
    }
}
