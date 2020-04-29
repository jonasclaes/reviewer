import { IUser, IUserConstructorProperties } from ".";
import { database } from "../database";
import bcrypt from "bcrypt";

export class User implements IUser {
    public id: number | null = null;
    public firstName: string | null = null;
    public lastName: string | null = null;
    public username: string | null = null;
    public email: string | null = null;
    public password: string | null = null;
    public googleId: string | null = null;
    public role: string | null = null;

    constructor (props?: IUserConstructorProperties) {
        if (props) {
            this.id = props.id || null;
            this.firstName = props.firstName || null;
            this.lastName = props.lastName || null;
            this.username = props.username || null;
            this.email = props.email || null;
            this.password = props.password || null;
            this.googleId = props.googleId || null;
            this.role = props.role || null;
        }
    }

    public static async createTable(): Promise<void> {
        await new Promise((resolve, reject) => {
            database.getConnection().query("CREATE TABLE `users` (`id` int(11) NOT NULL, `firstName` tinytext, `lastName` tinytext, `username` tinytext, `email` text, `password` text, `googleId` tinytext, `role` tinytext COLLATE utf8_unicode_ci NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", (err, results, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        await new Promise((resolve, reject) => {
            database.getConnection().query("ALTER TABLE `users` ADD PRIMARY KEY (`id`)", (err, results, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        await new Promise((resolve, reject) => {
            database.getConnection().query("ALTER TABLE `users` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT", (err, results, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public static findAll(limit: number, offset: number): Promise<User[]> {
        return new Promise((resolve, reject) => {
            database.getConnection().query("SELECT * FROM `users` LIMIT ? OFFSET ?", [limit, offset], (err, results: IUser[], fields) => {
                if (err) {
                    reject(err);
                } else {
                    const returnArray: User[] = [];
                    results.forEach(element => {
                        returnArray.push(new User(element));
                    });
                    resolve(returnArray);
                }
            });
        });
    }

    public static findById(id: number): Promise<User> {
        return new Promise((resolve, reject) => {
            database.getConnection().query("SELECT * FROM `users` WHERE id = ?", [id], (err, results: IUser[], fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(new User(results[0]));
                }
            });
        });
    }

    public static findByUsername(username: string): Promise<User> {
        return new Promise((resolve, reject) => {
            database.getConnection().query("SELECT * FROM `users` WHERE username = ?", [username], (err, results: IUser[], fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(new User(results[0]));
                }
            });
        });
    }

    public static findByEmail(email: string): Promise<User> {
        return new Promise((resolve, reject) => {
            database.getConnection().query("SELECT * FROM `users` WHERE email = ?", [email], (err, results: IUser[], fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(new User(results[0]));
                }
            });
        });
    }

    public static findByUsernameOrEmail(usernameOrEmail: string): Promise<User> {
        return new Promise((resolve, reject) => {
            database.getConnection().query("SELECT * FROM `users` WHERE username = ? OR email = ?", [usernameOrEmail, usernameOrEmail], (err, results: IUser[], fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(new User(results[0]));
                }
            });
        });
    }

    public hashPassword(): Promise<string> {
        if (this.password != null) {
            return new Promise((resolve, reject) => {
                bcrypt.hash(this.password, parseInt(process.env.SALT_ROUNDS || "12"), (err, hash) => {
                    err ? reject(err) : resolve(hash);
                });
            });
        } else {
            return new Promise((resolve, reject) => { reject("Password is null.") });
        }
    }

    public checkPassword(password: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, this.password || "", (err, result) => {
                err ? reject(err) : resolve(result);
            });
        });
    }

    public save(): Promise<void> {
        if (this.id == null) {
            // Insert;
            // NOTE: Password should always be in a bcrypt salted hash format;
            return new Promise(async (resolve, reject) => {
                const hashedPassword = await this.hashPassword();
                database.getConnection().query("INSERT INTO `users` (`id`, `firstName`, `lastName`, `username`, `email`, `password`, `googleId`, `role`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)", [this.firstName, this.lastName, this.username, this.email, hashedPassword, this.googleId, this.role], (err, results, fields) => {
                    err ? reject(err) : resolve();
                });
            });
        } else {
            // Update;
            // NOTE: Password should always be in a bcrypt salted hash format;
            return new Promise((resolve, reject) => {
                database.getConnection().query("UPDATE `users` SET `firstName` = ?, `lastName` = ?, `username` = ?, `email` = ?, `password` = ?, `googleId` = ?, `role` = ? WHERE `users`.`id` = ?", [this.firstName, this.lastName, this.username, this.email, this.password, this.googleId, this.role, this.id], (err, results, fields) => {
                    err ? reject(err) : resolve();
                });
            });
        }
    }

    public delete(): Promise<void> {
        if (this.id != null) {
            return new Promise((resolve, reject) => {
                database.getConnection().query("DELETE FROM `users` WHERE `users`.`id` = ?", [this.id], (err, results, fields) => {
                    err ? reject(err) : resolve();
                });
            });
        } else {
            return new Promise((resolve, reject) => { reject("ID is null.") });
        }
    }
}