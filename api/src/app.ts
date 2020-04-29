import http from "http";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";

// Load environment variables from .env;
dotenv.config();

// Import components;
// This is supposed to be after the dotenv requirement
// else the right config vars are not loaded;
import { database } from "./common/database";
import { router as categoryRouter, Category } from "./common/category";
import { router as courseRouter, Course } from "./common/course";
import { router as userRouter, User } from "./common/user";

// Setup Express;
const app = express();

// Setup proxy;
if (process.env.PROXY_ADDR != undefined) {
    app.set("trust proxy", process.env.PROXY_ADDR);
}

// Setup body-parser with the app;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup CORS;
app.use(cors());

// Setup morgan with the app;
app.use(morgan(process.env.LOG_MODE || "dev"));

// Setup routes;
app.use("/api/category", categoryRouter);
app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);

const startServer = async () => {
    try {
        await database.connect();

        // Check if categories table exists;
        await new Promise(async (resolve, reject) => {
            database.getConnection().query("SHOW TABLES LIKE ?", ["categories"], async (err, results, fields) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.length < 1) {
                        console.log(`Categories table doesnt exist. Creating now...`);
                        await Category.createTable();
                        console.log(`Categories table created.`);
                        resolve();
                    } else {
                        resolve();
                    }
                }
            });
        });

        // Check if courses table exists;
        await new Promise(async (resolve, reject) => {
            database.getConnection().query("SHOW TABLES LIKE ?", ["courses"], async (err, results, fields) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.length < 1) {
                        console.log(`Courses table doesnt exist. Creating now...`);
                        await Course.createTable();
                        console.log(`Courses table created.`);
                        resolve();
                    } else {
                        resolve();
                    }
                }
            });
        });

        // Check if users table exists;
        await new Promise(async (resolve, reject) => {
            database.getConnection().query("SHOW TABLES LIKE ?", ["users"], async (err, results, fields) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.length < 1) {
                        console.log(`Users table doesnt exist. Creating now...`);
                        await User.createTable();
                        console.log(`Users table created.`);
                        resolve();
                    } else {
                        resolve();
                    }
                }
            });
        });
    } catch (err) {
        console.error("An error occured while connecting to the database.", err);
        process.exit(1000);
    }

    const httpPort = process.env.SERVER_PORT_HTTP || 3000;

    const httpServer = http.createServer(app);

    await new Promise(resolve => httpServer.listen(httpPort, resolve));
    console.log(`Listening on port ${httpPort}`);
}

startServer();