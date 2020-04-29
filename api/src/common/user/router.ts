import { Router } from "express";
import { User } from ".";
import { authorize } from "../authorization";

export const router = Router();

router.get("/", authorize, async (req, res) => {
    const limit = <string> req.query.limit;
    const offset = <string> req.query.offset;

    const categories = await User.findAll(parseInt(limit || "100"), parseInt(offset || "0"));

    res.json(categories);
});

router.get("/:name", authorize, async (req, res) => {
    const category = await User.findByUsername(req.params.name);

    res.json(category);
});

router.post("/", authorize, async (req, res) => {
    const category = new User(req.body);

    try {
        await category.save();
        res.status(200).send("OK");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error.");
    }
});

router.put("/", authorize, async (req, res) => {
    const category = new User(req.body);

    try {
        await category.save();
        res.status(200).send("OK");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error.");
    }
});

router.delete("/", authorize, async (req, res) => {
    if (typeof req.query.id === "string") {
        try {
            const category = await User.findById(parseInt(req.query.id));

            await category.delete();

            res.status(200).send("OK");
        } catch (err) {
            console.error(err);
            res.status(500).send("Internal server error.");
        }
    } else {
        res.status(500).send("Internal server error.");
    }
});