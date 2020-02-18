import { Router, Request, Response, NextFunction } from "express";

import { User } from "./../users/models/User";

import { genSalt, hash, compare } from "bcryptjs";
import * as jwt from "jsonwebtoken";
import * as EmailValidator from "email-validator";

import * as config from "./../config/config";

const router: Router = Router();

async function generatePasswordHash(password: string): Promise<string> {
    const rounds = 10;
    const salt = await genSalt(rounds);
    const hashed = await hash(password, salt);
    return hashed;
}

async function comparePasswords(password: string, hash: string): Promise<boolean> {
    return await compare(password, hash);
}

export function generateJWT(user: User): string {
    const userJson = user.toJson();
    return jwt.sign(userJson, config.jwt.secret);
}

declare global {
    namespace Express {
        interface Request {
            user: Object
        }
    }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {

    if (!req.headers || !req.headers.authorization) {
        return res.status(401).json({
            message: "No authorization headers"
        });
    }

    // Authorization: Bearer token
    const authHeader = req.headers.authorization.split(" ");

    if (authHeader.length != 2) {
        return res.status(401).json({ message: "Invalid token" });
    }

    const token = authHeader[1];

    try {
        const decoded = jwt.verify(token, config.jwt.secret);
        req.user = decoded;
        return next();
    } catch (ex) {
        return res.status(500).json({ message: "Invalid token" });
    }
}

router.post("/register", async (req: Request, res: Response) => {
    const { email, password } = req.body;

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

    if (user) {
        return res.status(422).json({
            auth: false,
            message: "User already exists"
        });
    }

    const password_hash = await generatePasswordHash(password);

    const newUser = await new User({
        email,
        password: password_hash
    });

    let savedUser;

    try {
        savedUser = await newUser.save();
    } catch (ex) {
        throw ex;
    }

    const jwt = generateJWT(savedUser);

    return res.status(201).json({
        token: jwt,
        user: savedUser.short()
    });

});

router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

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

// Sanity check to verify whether user is authorized
router.get("/verify", requireAuth, async (req: Request, res: Response) => {
    res.status(200).json({ authorized: true, message: "Authorized" });
});

const AuthRouter: Router = router;
export default AuthRouter;