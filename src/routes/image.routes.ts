import { Router } from "express";
import imageController from "@/controller/image.controller";
import { imageUpload } from "@/uploader";

const router = Router();

router.get("/", imageController.test);
router.post(
  "/upload",
  imageUpload.single("image"),
  imageController.uploadImage
);

export default router;
