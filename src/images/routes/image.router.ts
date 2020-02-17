import { Router, Request, Response, NextFunction } from 'express';
import { filterImageFromURL, deleteLocalFiles } from './../../util/util';
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

router.get("/upload", requireAuth, async (req: Request, res: Response) => {
    res.status(200).json({ message: "Authorized" });
});

const ImageRouter: Router = router;
export default ImageRouter;
