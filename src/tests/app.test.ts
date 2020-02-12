import request from "supertest";
import app from "../app";

it("should return status 200", async () => {
  const res = await request(app).get("/");
  expect(res.status).toEqual(200);
  expect(res.text).toEqual("try GET /images/filtered?image_url={{}}")
});
