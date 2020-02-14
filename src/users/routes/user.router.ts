import { Router, Request, Response } from "express";
import Joi from "@hapi/joi";

import { User } from "./../models/User";

const router: Router = Router();

const schema = Joi.object({ id: Joi.string().guid() });

router.get("/", async (req: Request, res: Response) => {
    // TODO: Add page and limitTo query params
    const { page, limitTo } = req.query;
    const users = await User.findAll({ attributes: ["email", "id"] });
    res.json({ users });
});

router.post("/", async (req: Request, res: Response) => {
    const data = req.body;
    if (data.email && data.password) {
        const user = await User.create(data);

        res.json({
            id: user.id,
            email: user.email
        });
    } else {
        res.status(400).json({
            "error": "Please provide valid user details"
        })
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    const { error, value } = schema.validate({ id: id });

    if (error) {
        return res.status(400).json({
            message: "Please provide a valid id"
        });
    }

    const user = await User.findByPk(value.id, { attributes: ["id", "email"] });

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    return res.status(200).json(user);
});

router.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    const { error, value } = schema.validate({ id: id });

    if (error) {
        return res.status(400).json({
            message: "Please provide a valid id"
        });
    }

    const user: User = await User.findByPk(value.id, { attributes: ["id", "email"] });

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }


    const userToDelete = user.short();

    user.destroy();

    return res.status(200).json({
        success: true,
        message: "User deleted",
        user: userToDelete
    });
});

const UserRouter: Router = router;
export default UserRouter;