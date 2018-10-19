export interface NewUser {
    username: string;
    email: string;
    password: string;
}

export interface User extends NewUser {
    id: number;
}
