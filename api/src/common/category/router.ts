import { Router } from "express";
import { Category } from ".";
import { authorize } from "../authorization";

export const router = Router();

router.get("/", async (req, res) => {
    const limit = <string> req.query.limit;
    const offset = <string> req.query.offset;

    const categories = await Category.findAll(parseInt(limit || "100"), parseInt(offset || "0"));

    res.json(categories);
});

router.get("/:name", async (req, res) => {
    const category = await Category.findByName(req.params.name);

    res.json(category);
});

router.post("/", authorize, async (req, res) => {
    const category = new Category(req.body);

    try {
        await category.save();
        res.status(200).send("OK");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error.");
    }
});

router.put("/", authorize, async (req, res) => {
    const category = new Category(req.body);

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
            const category = await Category.findById(parseInt(req.query.id));

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