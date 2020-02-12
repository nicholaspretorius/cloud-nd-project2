import { resolve } from "path";
import express from 'express';
import bodyParser from 'body-parser';
import { config } from "dotenv";
config({ path: resolve(__dirname, "./../.env") });

import db from "./db";

import MODELS from "./models";
import ImageRouter from "./images/routes/image.router";
import UserRouter from "./users/routes/user.router";

// Initialise the Express application
const app = express();

db.addModels(MODELS);
db.sync();

// Use the body parser middleware for post requests
app.use(bodyParser.json());

app.use("/images", ImageRouter);
app.use("/users", UserRouter);

// Displays a simple message to the user
app.get("/", async (req, res) => {
  res.send("try GET /images/filtered?image_url={{}}")
});

export default app;