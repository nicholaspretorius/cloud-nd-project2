import request from "supertest";
import uuidv4 from "uuid/v4";
import app from "./../../../app";
import { User } from "./../../../users/models/User";

afterEach(async () => {
    User.destroy({
        where: {},
        truncate: true
    });
});

describe("GET /users empty", () => {
    it("should return a status of 200", async () => {
        const res = await request(app).get("/users");
        expect(res.status).toEqual(200);
    });
});

describe("GET /users populated", () => {

    let uuid: string;

    beforeEach(async () => {
        const data = {
            "email": "test@test.com",
            "password": "123456"
        }
        const user = await User.create(data);
        uuid = user.id;
    });

    it("should return a status of 200 with 1 user", async () => {
        const res = await request(app).get("/users");
        expect(res.status).toEqual(200);
        expect(res.body.users.length).toBe(1);
    });
});

describe("GET /users/:id", () => {

    let uuid: string;

    beforeEach(async () => {
        const data = {
            "email": "test@test.com",
            "password": "123456"
        }
        const user = await User.create(data);
        uuid = user.id;
    });

    it("should return a status of 400 if id is not a valid uuid", async () => {
        const res = await request(app).get(`/users/1`);
        expect(res.status).toEqual(400);
    });

    it("should return a status of 404 if no user is found", async () => {
        const id = uuidv4();
        const res = await request(app).get(`/users/${id}`);
        expect(res.status).toEqual(404);
    });

    it("should return a status of 200", async () => {
        const res = await request(app).get(`/users/${uuid}`);
        expect(res.status).toEqual(200);
    });
});

describe("POST /users", () => {

    it("should return a status of 200 for valid user", async () => {

        const data = {
            "email": "test@test.com",
            "password": "password"
        };

        const res = await (await request(app).post("/users").send(data));
        expect(res.status).toEqual(200);
        expect(res.body.email).toEqual(data.email);
    });

    it("should return a status of 400 for an invalid user", async () => {

        const data = {
            "password": "password"
        };

        const res = await (await request(app).post("/users").send(data));
        expect(res.status).toEqual(400);
    });
});

describe("DELETE /users/:id", () => {
    let uuid: string;

    beforeEach(async () => {
        const data = {
            "email": "test@test.com",
            "password": "123456"
        }
        const user = await User.create(data);
        uuid = user.id;
    });

    it("should return a status of 400 if id is not a valid uuid", async () => {
        const res = await request(app).delete(`/users/1`);
        expect(res.status).toEqual(400);
    });

    it("should return a status of 404 if no user is found", async () => {
        const id = uuidv4();
        const res = await request(app).delete(`/users/${id}`);
        expect(res.status).toEqual(404);
    });

    it("should return a status of 200", async () => {
        const res = await request(app).delete(`/users/${uuid}`);
        expect(res.status).toEqual(200);
    });
});