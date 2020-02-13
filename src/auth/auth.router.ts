import { Router, Request, Response, NextFunction } from "express";

import { User } from "./../users/models/User";

import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as EmailValidator from "email-validator";

import * as config from "./../config/config";

const router: Router = Router();

async function generatePasswordHash(password: string): Promise<string> {
    const rounds = 10;
    const salt = await bcrypt.genSalt(rounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

async function comparePasswords(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}

function generateJWT(user: User): string {
    return jwt.sign(user, config.jwt.secret);
}

router.post("/login", async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;

    console.log(email, password);

    if (!email || !EmailValidator.validate(email)) {
        return res.status(400).json({
            auth: false,
            message: "Email is not valid"
        })
    }

    if (!password) {
        return res.status(400).json({
            auth: false,
            message: "Password is required"
        });
    }

    const user = await User.findOne({ where: { email: email } });

    if (!user) {
        return res.status(401).json({
            auth: false,
            message: "Email or password invalid"
        });
    }

    const passwordMatch = await comparePasswords(password, user.password);

    if (!passwordMatch) {
        return res.status(401).json({
            auth: false,
            message: "Unauthorized"
        })
    }

    const jwt = generateJWT(user);

    res.status(200).json({
        auth: true,
        token: jwt,
        user: user.short()
    });
});

const AuthRouter: Router = router;
export default AuthRouter;