import { ICategory, ICategoryConstructorProperties } from ".";
import { database } from "../database";

export class Category implements ICategory {
    public id: number | null = null;
    public name: string | null = null;

    constructor (props?: ICategoryConstructorProperties) {
        if (props) {
            this.id = props.id || null;
            this.name = props.name || null;
        }
    }

    public static async createTable(): Promise<void> {
        await new Promise((resolve, reject) => {
            database.getConnection().query("CREATE TABLE `categories` (`id` int(11) NOT NULL, `name` tinytext COLLATE utf8_unicode_ci NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", (err, results, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        await new Promise((resolve, reject) => {
            database.getConnection().query("ALTER TABLE `categories` ADD PRIMARY KEY (`id`)", (err, results, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        await new Promise((resolve, reject) => {
            database.getConnection().query("ALTER TABLE `categories` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT", (err, results, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public static findAll(limit: number, offset: number): Promise<Category[]> {
        return new Promise((resolve, reject) => {
            database.getConnection().query("SELECT * FROM `categories` LIMIT ? OFFSET ?", [limit, offset], (err, results: ICategory[], fields) => {
                if (err) {
                    reject(err);
                } else {
                    const returnArray: Category[] = [];
                    results.forEach(element => {
                        returnArray.push(new Category(element));
                    });
                    resolve(returnArray);
                }
            });
        });
    }

    public static findById(id: number): Promise<Category> {
        return new Promise((resolve, reject) => {
            database.getConnection().query("SELECT * FROM `categories` WHERE id = ?", [id], (err, results: ICategory[], fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(new Category(results[0]));
                }
            });
        });
    }

    public static findByName(name: string): Promise<Category> {
        return new Promise((resolve, reject) => {
            database.getConnection().query("SELECT * FROM `categories` WHERE name = ?", [name], (err, results: ICategory[], fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(new Category(results[0]));
                }
            });
        });
    }

    public save(): Promise<void> {
        if (this.id == null) {
            // Insert;
            return new Promise((resolve, reject) => {
                database.getConnection().query("INSERT INTO `categories` (`id`, `name`) VALUES (NULL, ?)", [this.name], (err, results, fields) => {
                    err ? reject(err) : resolve();
                });
            });
        } else {
            // Update;
            return new Promise((resolve, reject) => {
                database.getConnection().query("UPDATE `categories` SET `name` = ? WHERE `categories`.`id` = ?", [this.name, this.id], (err, results, fields) => {
                    err ? reject(err) : resolve();
                });
            });
        }
    }

    public async delete(): Promise<void> {
        if (this.id != null) {
            return new Promise((resolve, reject) => {
                database.getConnection().query("DELETE FROM `categories` WHERE `categories`.`id` = ?", [this.id], (err, results, fields) => {
                    err ? reject(err) : resolve();
                });
            });
        }
    }
}