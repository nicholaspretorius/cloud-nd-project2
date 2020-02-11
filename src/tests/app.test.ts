import request from "supertest";
import app from "../app";

describe("GET /", () => {
  it("should return status 200", async () => {
    const res = await request(app).get("/");
    expect(res.status).toEqual(200);
    expect(res.text).toEqual("try GET /filteredimage?image_url={{}}")
  });
});

describe("Sanity", () => {
  it("should expect true to be truthy", () => {
    expect(true).toBe(true);
  });
});
