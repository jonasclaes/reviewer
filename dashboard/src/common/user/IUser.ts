export interface IUser {
    id: number | null ;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    email: string | null;
    password: string | null;
    googleId: string | null;
    role: string | null;
    hashPassword(): Promise<string>;
    checkPassword(password: string): Promise<boolean>;
    save(): Promise<void>;
    delete(): Promise<void>;
}