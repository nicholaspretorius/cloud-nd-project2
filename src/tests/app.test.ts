import request from "supertest";
import app from "../app";

describe("GET /", () => {
  it("should return status 200", async () => {
    const res = await request(app).get("/");
    expect(res.status).toEqual(200);
    expect(res.text).toEqual("try GET /filteredimage?image_url={{}}")
  });
});

describe("GET /filterimage", () => {

  const image_url = "https://cdn.pixabay.com/photo/2020/02/04/22/29/owl-4819550_1280.jpg";

  it("should return a status of 400 if image_url query paramter not provided", async () => {
    const res = await request(app).get("/filteredimage");
    expect(res.status).toEqual(400);
    expect(res.body.error).toBe("Please provide the image_url query parameter with a valid image url");
  });

  it("should return a status of 400 if image_url is blank", async () => {
    const res = await request(app).get("/filteredimage?image_url=");
    expect(res.status).toEqual(400);
    expect(res.body.error).toBe("Please provide the image_url query parameter with a valid image url");
  });

  it("should return a status of 400 if image_url is not populated", async () => {
    const res = await request(app).get("/filteredimage?image_url");
    expect(res.status).toEqual(400);
    expect(res.body.error).toBe("Please provide the image_url query parameter with a valid image url");
  });

  it("should return a status of 422 if a valid image_url is not provded", async () => {
    const res = await request(app).get("/filteredimage?image_url=blah");
    expect(res.status).toEqual(422);
    expect(res.body.error).toContain("Unprocessable entry. No such file:");
  });

  it("should return a status of 200 if a valid image_url is provided", async () => {
    const res = await request(app).get(`/filteredimage?image_url=${image_url}`);
    expect(res.status).toEqual(200);
  });
});

describe("Sanity", () => {
  it("should expect true to be truthy", () => {
    expect(true).toBe(true);
  });
});
