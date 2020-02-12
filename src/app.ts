import express from 'express';
import bodyParser from 'body-parser';
import ImageRouter from "./images/routes/image.router";

// Initialise the Express application
const app = express();

// Use the body parser middleware for post requests
app.use(bodyParser.json());

app.use("/images", ImageRouter);

// Displays a simple message to the user
app.get("/", async (req, res) => {
  res.send("try GET /images/filtered?image_url={{}}")
});

export default app;