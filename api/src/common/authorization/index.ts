import { Request, Response, NextFunction } from "express";

export const authorize = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization === process.env.API_PASSWORD) {
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
}