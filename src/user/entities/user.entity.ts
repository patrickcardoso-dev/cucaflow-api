export class User {
    constructor(
        protected id: string, 
        protected username: string, 
        protected email: string, 
        protected password: string,
        protected avatar?: string,
        protected isSocialLogin?: boolean
    ) {}
}