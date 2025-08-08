export class HTTPError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class SignInError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}
