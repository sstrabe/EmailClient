interface Object {
    email: string,
    password: string
}

declare namespace Express {
    export interface Request {
       auth?: Object
    }
 }