import { Router, Request, Response } from "express";

import { User } from "./../models/User";

const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
    // TODO: Add page and limitTo query params
    const { page, limitTo } = req.query;
    const users = await User.findAll({});
    res.json({ users });
});

router.post("/", async (req: Request, res: Response) => {
    const data = req.body;
    if (data) {
        const user = await User.create(data);

        res.json({
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    } else {
        res.json({
            "error": "Please provide valid user details"
        })
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await User.findByPk(id);
    res.json(user);
});

const UserRouter: Router = router;
export default UserRouter;