import { Router, Request, Response, NextFunction } from 'express';
import Joi from "@hapi/joi";
import { filterImageFromURL, deleteLocalFiles } from './../../util/util';
import * as AWS from "../../aws";
import { requireAuth } from "./../../auth/auth.router";
import { Image } from "./../models/Image";

const router: Router = Router();

// Joi schema for id validation
const schema = Joi.object({ id: Joi.number() });

// Filters the image
router.get("/filtered", async (req: Request, res: Response, next: NextFunction) => {

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

// GET all the images
router.get("/", requireAuth, async (req: Request, res: Response) => {
    const images = await Image.findAndCountAll({ order: [['id', 'DESC']] });
    images.rows.map(image => {
        if (image.url) {
            const fileName = image.url.split("://")[1].split("/")[1];
            image.url = AWS.getGetSignedUrl(fileName);
        }
    });
    res.json({ images });
});

// GET /images/:id
router.get("/:id", requireAuth, async (req: Request, res: Response) => {
    const { id } = req.params;

    const { error, value } = schema.validate({ id: id });

    if (error) {
        return res.status(400).json({
            message: "Please provide a valid id"
        });
    }

    const image = await Image.findByPk(value.id, { attributes: ["id", "url"] });

    if (!image) {
        return res.status(404).json({
            message: "Image not found"
        });
    }

    if (image.url) {
        const fileName = image.url.split("://")[1].split("/")[1];
        image.url = AWS.getGetSignedUrl(fileName);
    } else {
        image.url = "No image available";
    }

    res.json({ image });
});

// GET a signed url to upload/put a new image into the bucket
router.get('/upload-url/:fileName', requireAuth, async (req: Request, res: Response) => {
    let { fileName } = req.params;
    const url = AWS.getPutSignedUrl(fileName);
    res.status(201).send({ url: url });
});

// GET a signed url to view image in the bucket
router.get('/signed-url/:fileName', requireAuth, async (req: Request, res: Response) => {
    let { fileName } = req.params;
    const url = AWS.getGetSignedUrl(fileName);
    res.status(201).send({ url: url });
});

const ImageRouter: Router = router;
export default ImageRouter;
