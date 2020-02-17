import request from "supertest";
import app from "./../../../app";
import { User } from "./../../../users/models/User";

describe("GET /images/filtered", () => {

    const image_url = "https://cdn.pixabay.com/photo/2020/02/04/22/29/owl-4819550_1280.jpg";

    it("should return a status of 400 if image_url query paramter not provided", async () => {
        const res = await request(app).get("/images/filtered");
        expect(res.status).toEqual(400);
        expect(res.body.error).toBe("Please provide the image_url query parameter with a valid image url");
    });

    it("should return a status of 400 if image_url is blank", async () => {
        const res = await request(app).get("/images/filtered?image_url=");
        expect(res.status).toEqual(400);
        expect(res.body.error).toBe("Please provide the image_url query parameter with a valid image url");
    });

    it("should return a status of 400 if image_url is not populated", async () => {
        const res = await request(app).get("/images/filtered?image_url");
        expect(res.status).toEqual(400);
        expect(res.body.error).toBe("Please provide the image_url query parameter with a valid image url");
    });

    it("should return a status of 422 if a valid image_url is not provded", async () => {
        const res = await request(app).get("/images/filtered?image_url=blah");
        expect(res.status).toEqual(422);
        expect(res.body.error).toContain("Unprocessable entry. No such file:");
        expect(res.body.code).toEqual("ENOENT");
    });

    it("should return a status of 200 if a valid image_url is provided", async () => {
        const res = await request(app).get(`/images/filtered?image_url=${image_url}`);
        expect(res.status).toEqual(200);
    });
});

describe("GET /images/upload", () => {

    afterEach(async () => {
        User.destroy({
            where: {},
            truncate: true
        });
    });

    it("should return a status of 401 if not authorization header is provided", async () => {
        const res = await request(app).get("/images/upload");
        expect(res.status).toEqual(401);
        expect(res.body.message).toBe("No authorization headers");
    });

    it("should return a status of 401 if authorization header is invalid", async () => {
        const res = await request(app).get("/images/upload").set('Authorization', 'invalid');
        expect(res.status).toEqual(401);
        expect(res.body.message).toBe("Invalid token");
    });

    it("should return a status of 401 if token is invalid", async () => {
        const res = await request(app).get("/images/upload").set('Authorization', 'Bearer invalid');
        expect(res.status).toEqual(500);
        expect(res.body.message).toBe("Invalid token");
    });

    it("should return a status of 200 if token is valid", async () => {
        const userData = {
            "email": "test@test.com",
            "password": "123456"
        }
        const res1 = await request(app).post("/auth/register").send(userData);
        expect(res1.status).toEqual(201);
        const token = res1.body.token;

        const res = await request(app).get("/images/upload").set('Authorization', `Bearer ${token}`);
        expect(res.status).toEqual(200);
        expect(res.body.message).toBe("Authorized");
    });
});