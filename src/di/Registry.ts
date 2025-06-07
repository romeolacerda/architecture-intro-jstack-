
type Constructor<T> = new (...args: any[]) => T


export class Registry{
    private static instance: Registry
    static getInstance() {
        if (!this.instance) {
            this.instance = new Registry()
        }

        return this.instance
    }

    private readonly services: Map<string, Constructor<any>> = new Map()

    private constructor() { }


    register<T>(implementation: Constructor<T>) {
        const token = implementation.name

        if (this.services.has(token)) {
            throw new Error(`The ${token} is already registred`)
        }

        this.services.set(implementation.name, implementation)
    }

    resolve<T>(implementation: Constructor<T>): T {
        const token = implementation.name
        const impl = this.services.get(token)

        if (!impl) {
            throw new Error(`${token} has not been found in Registry`)
        }

        return new impl()
    }

}
