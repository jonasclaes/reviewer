import { Router } from "express";
import { Course } from ".";

export const router = Router();

router.get("/", async (req, res) => {
    const limit = <string> req.query.limit;
    const offset = <string> req.query.offset;

    const courses = await Course.findAll(parseInt(limit || "100"), parseInt(offset || "0"));

    res.json(courses);
});

router.get("/:name", async (req, res) => {
    const course = await Course.findByName(req.params.name);
    
    res.json(course);
});

router.post("/", async (req, res) => {
    const course = new Course(req.body);

    try {
        await course.save();
        res.status(200).send("OK");
    } catch (err) {
        res.status(500).send("Internal server error.");
    }
});

router.put("/", async (req, res) => {
    const course = new Course(req.body);

    try {
        await course.save();
        res.status(200).send("OK");
    } catch (err) {
        res.status(500).send("Internal server error.");
    }
});