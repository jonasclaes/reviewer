import mysql, { Connection, ConnectionConfig } from "mysql";

export class Database {
    private connection: Connection;

    constructor(connectionCreds: ConnectionConfig) {
        this.connection = mysql.createConnection(connectionCreds);
    }

    public connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.connection.connect(err => {
                err ? reject(err) : resolve();
            });
        });
    }

    public disconnect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                err ? reject(err) : resolve();
            });
        });
    }

    public getConnection(): Connection {
        return this.connection;
    }
}