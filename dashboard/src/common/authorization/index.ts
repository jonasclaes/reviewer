import { Request, Response, NextFunction } from "express";
import { User } from "../user";

export const authorize = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization === process.env.API_PASSWORD) {
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
}

export const authorizeSession = (req: Request, res: Response, next: NextFunction) => {
    if (req.session!.loggedIn === true) {
        next();
    } else {
        res.redirect(`/login?ref=${req.originalUrl}`);
    }
}

export const authorizeSessionAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (req.session!.loggedIn === true) {
        const user = await User.findByUsername(req.session!.username);

        if (user.role == "Admin") {
            next();
        } else {
            res.redirect("/");
        }
    } else {
        res.redirect(`/login?ref=${req.originalUrl}`);
    }
}