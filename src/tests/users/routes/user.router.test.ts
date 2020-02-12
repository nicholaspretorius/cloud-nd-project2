import request from "supertest";
import app from "./../../../app";

describe("GET /users", () => {
    it("should return a status of 200", async () => {
        const res = await request(app).get("/users");
        expect(res.status).toEqual(200);
    });
});

describe("GET /users/:id", () => {
    it("should return a status of 200", async () => {
        const res = await request(app).get("/users/1");
        expect(res.status).toEqual(200);
    });
});