import { MysqlError } from "mysql";

export interface ICategory {
    id: number | null ;
    name: string | null;
    save(): Promise<void>;
    delete(): Promise<void>;
}