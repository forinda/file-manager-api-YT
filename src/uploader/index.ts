import { AppRequest } from "@/type";
import multer from "multer";
import { pathConfig } from "@/config";
import path from "node:path";
import { FIleHelpers } from "@/helpers/file-helpers";
import { ImageMimeTypes } from "@/type/mimetypes";

const imageStorage = multer.diskStorage({
  destination: function (_req: AppRequest, _file: Express.Multer.File, cb) {
    try {
      const uploadFolder = path.join(pathConfig.uploadDir, "images");
      //   Check if folder exist or not
      // If exist it's okay else create new paths
      FIleHelpers.createFolder(uploadFolder);
      cb(null, uploadFolder);
    } catch (error) {
        console.log('Err');
        
      cb(error, null as any);
    }
  },
  filename: function (_req: AppRequest, file, cb) {
    const filename = FIleHelpers.generateFileName(file.originalname);
    cb(null, filename);
  },
});

const imageFilters: multer.Options["fileFilter"] = function (
  req: AppRequest,
  file,
  cb
) {
  const whitelistedImages: ImageMimeTypes[] = [
    "image/svg+xml",
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
    "image/gif",
  ];
  if (whitelistedImages.includes(file.mimetype as ImageMimeTypes)) {
    cb(null, true);
  } else {
    cb(new Error("Image type not supported") as any, false);
  }
};

const imageUpload = multer({
  storage: imageStorage,
  fileFilter: imageFilters,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

export { imageUpload };
