import request from "supertest";
import app from "./../../app"
import { User } from "./../../users/models/User";

afterEach(async () => {
    User.destroy({
        where: {},
        truncate: true
    });
});

describe("POST /register", () => {

    it("should return a status of 400 when submitting a user without a password", async () => {
        const data = {
            "email": "test@test.com"
        };

        const res = await request(app).post("/auth/register").send(data);
        expect(res.status).toEqual(400);
        expect(res.body.auth).toBe(false);
        expect(res.body.message).toEqual("Password is required");
    });

    it("should return a status of 400 when submitting a user without an email address", async () => {
        const data = {
            "password": "password"
        };

        const res = await request(app).post("/auth/register").send(data);
        expect(res.status).toEqual(400);
        expect(res.body.auth).toBe(false);
        expect(res.body.message).toEqual("Email is not valid");
    });

    it("should return a status of 400 when submitting a user without a valid email address", async () => {
        const data = {
            "email": "test",
            "password": "password"
        };

        const res = await request(app).post("/auth/register").send(data);
        expect(res.status).toEqual(400);
        expect(res.body.auth).toBe(false);
        expect(res.body.message).toEqual("Email is not valid");
    });

    it("should return a status of 422 when an existing user is recreated", async () => {

        const data = {
            "email": "test@test.com",
            "password": "123456"
        }
        const user = await User.create(data);
        const uuid = user.id;

        const duplicateUser = {
            "email": "test@test.com",
            "password": "password"
        };

        const res = await request(app).post("/auth/register").send(duplicateUser);
        expect(res.status).toEqual(422);
        expect(res.body.auth).toBe(false);
        expect(res.body.message).toEqual("User already exists");
    });

    it("should return a status of 201 when a valid user is submitted", async () => {
        const data = {
            "email": "test@test.com",
            "password": "password"
        };

        const res = await request(app).post("/auth/register").send(data);
        expect(res.status).toEqual(201);
        expect(res.body.token);
        expect(res.body.user.email).toEqual(data.email);
    });
});

describe("POST /login", () => {

    let uuid: string;

    beforeEach(async () => {
        const data = {
            "email": "test@test.com",
            "password": "123456"
        }
        const user = await User.create(data);
        uuid = user.id;
    });

    afterEach(async () => {
        User.destroy({
            where: {},
            truncate: true
        });
    });

    it("should return a status of 401 when logging in with the incorrect password", async () => {
        const data = {
            "email": "test@test.com",
            "password": "password"
        };

        const res = await request(app).post("/auth/login").send(data);
        expect(res.status).toEqual(401);
        expect(res.body.auth).toBe(false);
        expect(res.body.message).toEqual("Unauthorized");

    });

    it("should return a status of 401 when logging in with a user that does not exist", async () => {
        const data = {
            "email": "doesntexist@test.com",
            "password": "password"
        };

        const res = await request(app).post("/auth/login").send(data);
        expect(res.status).toEqual(401);
        expect(res.body.auth).toBe(false);
        expect(res.body.message).toEqual("Email or password invalid");

    });

    it("should return a status of 400 when not providing an email address", async () => {
        const data = {
            "password": "password"
        };

        const res = await request(app).post("/auth/login").send(data);
        expect(res.status).toEqual(400);
        expect(res.body.auth).toBe(false);
        expect(res.body.message).toEqual("Email is not valid");
    });

    it("should return a status of 400 when not providing a password", async () => {
        const data = {
            "email": "test@test.com"
        };

        const res = await request(app).post("/auth/login").send(data);
        expect(res.status).toEqual(400);
        expect(res.body.auth).toBe(false);
        expect(res.body.message).toEqual("Password is required");
    });

    it("should return a status of 200 when correctly logging in a user", async () => {

        const userData = {
            "email": "test1@test.com",
            "password": "123456"
        }
        const res1 = await request(app).post("/auth/register").send(userData);
        expect(res1.status).toEqual(201);

        const data = {
            "email": "test1@test.com",
            "password": "123456"
        }

        const res2 = await request(app).post("/auth/login").send(data);
        expect(res2.status).toEqual(200);
        expect(res2.body.auth).toBe(true);
        expect(res2.body.token);
        expect(res2.body.user.email).toEqual(data.email);
    });
});