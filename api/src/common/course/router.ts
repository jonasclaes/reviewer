import { Router } from "express";
import { Course } from ".";
import { authorize } from "../authorization";

export const router = Router();

router.get("/", async (req, res) => {
    const limit = <string> req.query.limit;
    const offset = <string> req.query.offset;

    try {
        let courses: Course[];
        if (req.query.search) {
            courses = await Course.findAllLike(parseInt(limit || "100"), parseInt(offset || "0"), req.query.search.toString());
        } else {
            courses = await Course.findAll(parseInt(limit || "100"), parseInt(offset || "0"));
        }
        

        if (req.query.populate === "true") {
            await Promise.all(courses.map(async element => {
                await element.populate();
            }));
        }
    
        res.json(courses);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error.");
    }
});

router.get("/:name", async (req, res) => {
    try {
        const course = await Course.findByName(req.params.name);

        if (req.query.populate === "true") {
            await course.populate();
        }
    
        res.json(course);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error.");
    }
});

router.post("/", authorize, async (req, res) => {
    const course = new Course(req.body);

    try {
        await course.save();
        res.status(200).send("OK");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error.");
    }
});

router.put("/", authorize, async (req, res) => {
    const course = new Course(req.body);

    try {
        await course.save();
        res.status(200).send("OK");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error.");
    }
});

router.delete("/", authorize, async (req, res) => {
    if (typeof req.query.id === "string") {
        try {
            const course = await Course.findById(parseInt(req.query.id));

            await course.delete();
    
            res.status(200).send("OK");
        } catch (err) {
            console.error(err);
            res.status(500).send("Internal server error.");
        }
    } else {
        res.status(500).send("Internal server error.");
    }
});