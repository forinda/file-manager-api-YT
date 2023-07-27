import { Router } from "express";
import imageController from "@/controller/image.controller";
import { imageUpload } from "@/uploader";

const router = Router();

router.get("/", imageController.test);
// Get all images
router.get("/all", imageController.getAllImages);
// Upload image
router.post(
  "/upload",
  imageUpload.single("image"),
  imageController.uploadImage
);
// Stream single image
router.get("/:imageId/stream", imageController.streamSingleImage);
// Get image by id
router.get("/:imageId", imageController.getImageById);
// Rename image
router.put("/:imageId/rename", imageController.renameImage);
// Move image to folder
router.put(
  "/:imageId/:folderId/move",
  imageController.moveImageToAnotherFolder
);
// Download image
router.get("/:imageId/download", imageController.downloadImage);
// Delete image
router.delete("/:imageId/delete", imageController.deleteImage);
// Copy image to folder
router.post("/:imageId/copy", imageController.copyImageToAnotherFolder);

export default router;
