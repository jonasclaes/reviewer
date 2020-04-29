import { ICourse, ICourseConstructorProperties } from ".";
import { database } from "../database";
import { Category } from "../category";

export class Course implements ICourse {
    public id: number | null = null;
    public timestamp: Date | null = null;
    public name: string | null = null;
    public description: string | null = null;
    public category: number | string | null = null;
    public videoUrl: string | null = null;

    constructor(props?: ICourseConstructorProperties) {
        if (props) {
            this.id = props.id || null;
            this.timestamp = props.timestamp || null;
            this.name = props.name || null;
            this.description = props.description || null;
            this.category = props.category || null;
            this.videoUrl = props.videoUrl || null;
        }
    }

    public static async createTable(): Promise<void> {
        await new Promise((resolve, reject) => {
            database.getConnection().query("CREATE TABLE `courses` (`id` int(11) NOT NULL, `timestamp` datetime NOT NULL, `name` tinytext COLLATE utf8_unicode_ci NOT NULL, `description` text COLLATE utf8_unicode_ci NOT NULL, `category` int(11) NOT NULL, `videoUrl` text COLLATE utf8_unicode_ci NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci", (err, results, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        await new Promise((resolve, reject) => {
            database.getConnection().query("ALTER TABLE `courses` ADD PRIMARY KEY (`id`), ADD KEY `category` (`category`)", (err, results, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        await new Promise((resolve, reject) => {
            database.getConnection().query("ALTER TABLE `courses` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT", (err, results, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        await new Promise((resolve, reject) => {
            database.getConnection().query("ALTER TABLE `courses` ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`category`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE", (err, results, fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public static async findAll(limit: number, offset: number, name: string): Promise<Course[]> {
        return new Promise((resolve, reject) => {
            database.getConnection().query("SELECT * FROM `courses` WHERE `name` LIKE ? ORDER BY timestamp DESC LIMIT ? OFFSET ?", ["%" + name + "%", limit, offset], (err, results: ICourse[], fields) => {
                if (err) {
                    reject(err);
                } else {
                    const returnArray: Course[] = [];
                    results.forEach(element => {
                        returnArray.push(new Course(element));
                    });
                    resolve(returnArray);
                }
            });
        });
    }

    public static async findById(id: number): Promise<Course> {
        return new Promise((resolve, reject) => {
            database.getConnection().query("SELECT * FROM `courses` WHERE id = ?", [id], (err, results: ICourse[], fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(new Course(results[0]));
                }
            });
        });
    }

    public static async findByName(name: string): Promise<Course> {
        return new Promise((resolve, reject) => {
            database.getConnection().query("SELECT * FROM `courses` WHERE name = ?", [name], (err, results: ICourse[], fields) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(new Course(results[0]));
                }
            });
        });
    }

    public async save(): Promise<void> {
        if (this.id == null) {
            // Insert;
            return new Promise((resolve, reject) => {
                database.getConnection().query("INSERT INTO `courses` (`id`, `timestamp`, `name`, `description`, `category`, `videoUrl`) VALUES (NULL, ?, ?, ?, ?, ?)", [this.timestamp, this.name, this.description, this.category, this.videoUrl], (err, results, fields) => {
                    err ? reject(err) : resolve();
                });
            });
        } else {
            // Update;
            return new Promise((resolve, reject) => {
                database.getConnection().query("UPDATE `courses` SET `timestamp` = ?, `name` = ?, `description` = ?, `category` = ?, `videoUrl` = ? WHERE `courses`.`id` = ?", [this.timestamp, this.name, this.description, this.category, this.videoUrl, this.id], (err, results, fields) => {
                    err ? reject(err) : resolve();
                });
            });
        }
    }

    public async delete(): Promise<void> {
        if (this.id != null) {
            return new Promise((resolve, reject) => {
                database.getConnection().query("DELETE FROM `courses` WHERE `courses`.`id` = ?", [this.id], (err, results, fields) => {
                    err ? reject(err) : resolve();
                });
            });
        }
    }

    public async populate(): Promise<void> {
        if (this.category) {
            try {
                const category = typeof this.category == "number" ? await Category.findById(this.category) : await Category.findById(parseInt(this.category));
                this.category = category.name;
            } catch (err) {
                throw err;
            }
        }
    }
}