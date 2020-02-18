import { Router, Request, Response, NextFunction } from 'express';
import { filterImageFromURL, deleteLocalFiles } from './../../util/util';
import * as AWS from "../../aws";
import { requireAuth } from "./../../auth/auth.router";

const router: Router = Router();

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
