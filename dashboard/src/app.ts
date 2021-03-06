import http from "http";
import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import morgan from "morgan";

// Load environment variables from .env;
dotenv.config();

// Import components;
// This is supposed to be after the dotenv requirement
// else the right config vars are not loaded;
import { database } from "./common/database";
import { Category } from "./common/category";
import { Course } from "./common/course";
import { User } from "./common/user";
import { authorizeSession, authorizeSessionAdmin } from "./common/authorization";

// Setup Express;
const app = express();

// Setup proxy;
if (process.env.PROXY_ADDR != undefined) {
    app.set("trust proxy", process.env.PROXY_ADDR);
}

// Setup EJS;
app.set("view engine", "ejs");

// Setup session middleware;
app.use(session({
    cookie: {
        secure: false
    },
    secret: process.env.SESSION_SECRET || "KRaOUtLNyBoFg8y4gwkt32rHMkdwicnZ",
    resave: true,
    saveUninitialized: true
}));

// Setup body-parser with the app;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Setup CORS;
app.use(cors());

// Setup morgan with the app;
app.use(morgan(process.env.LOG_MODE || "dev"));

// Setup routes;
app.get("/", authorizeSession, (req, res) => {
    res.render("pages/index");
});

app.get("/course", authorizeSession, (req, res) => {
    res.render("pages/course");
});

app.get("/admin/api-password", authorizeSessionAdmin, (req, res) => {
    res.send(process.env.API_PASSWORD);
});

app.get("/admin", authorizeSessionAdmin, (req, res) => {
    res.redirect("/admin/category");
});

app.get("/admin/category", authorizeSessionAdmin, (req, res) => {
    res.render("pages/admin-category");
});

app.get("/admin/course", authorizeSessionAdmin, (req, res) => {
    res.render("pages/admin-course");
});

app.get("/login", (req, res) => {
    res.render("pages/login");
});

app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const redirectUrl = req.body.redirectUrl;

    if (username && password) {
        const user = await User.findByUsernameOrEmail(username);

        if (user.username && user.password && await user.checkPassword(password)) {
            req.session!.loggedIn = true;
            req.session!.username = user.username;

            if (redirectUrl) {
                res.redirect(redirectUrl);
            } else {
                res.redirect("/");
            }
        } else {
            res.send("Incorrect username and/or password.");
        }
    } else {
        res.send("Please enter your username and password.");
    }
});

app.get("/register", (req, res) => {
    res.render("pages/register");
});

app.post("/register", async (req, res) => {
    const user = new User(req.body);
    user.role = "User";

    const errorArray: string[] = [];

    const checkUsername = await User.findByUsername(user.username || "");
    if (checkUsername.username !== null) {
        errorArray.push("Username already in use.");
    }

    const checkEmail = await User.findByEmail(user.email || "");
    if (checkEmail.email !== null) {
        errorArray.push("Email address already in use.");
    }

    if (errorArray.length > 0) {
        res.status(400).json(errorArray);
        return;
    }

    await user.save();

    req.session!.loggedIn = true;
    req.session!.username = user.username;

    res.redirect("/");
});

app.get("/logout", (req, res) => {
    req.session!.loggedIn = false;
    req.session!.username = null;
    req.session!.destroy(err => {
        err ? console.error(err) : null;
        res.redirect("/login");
    });
});

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