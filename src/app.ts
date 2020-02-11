import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

// Initialise the Express application
const app = express();

// Use the body parser middleware for post requests
app.use(bodyParser.json());

// Filters the image
app.get("/filteredimage", async (req: Request, res: Response, next: NextFunction) => {

  let filtered_image_location: string;

  if (!req.query.image_url || req.query.image_url === "") {
    return res.status(400).json({ "error": "Please provide the image_url query parameter with a valid image url" })
  } else {
    try {
      filtered_image_location = await filterImageFromURL(req.query.image_url);
      res.sendFile(filtered_image_location, {}, (err) => {
        if (err) {
          next(err)
        } else {
          deleteLocalFiles([filtered_image_location]);
        }
      })
    } catch (ex) {
      return res.status(422).json({
        "error": `Unprocessable entry. No such file: '/${ex.path}'`,
        "code": ex.code
      });
    }
  }
});

// Displays a simple message to the user
app.get("/", async (req, res) => {
  res.send("try GET /filteredimage?image_url={{}}")
});

export default app;