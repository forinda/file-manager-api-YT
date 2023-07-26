import { FIleHelpers } from "@/helpers/file-helpers";
import MongoIdValidator from "@/helpers/mongo-id";
import folderModel from "@/models/folder.model";
import mediafileModel, { IMediaFile } from "@/models/mediafile.model";
import { AppNext, AppRequest, AppResponse } from "@/type";

class ImageUploadController {
  async test(_req: AppRequest, res: AppResponse, next: AppNext) {
    try {
      return res.status(200).json({ message: "Image endpoint working" });
    } catch (err: any) {
      return next(err);
    }
  }
  async uploadImage(req: AppRequest, res: AppResponse, next: AppNext) {
    try {
      const {
        body: { folder },
        file,
      } = req;
      console.log(file);
      
      if (!folder) {
        FIleHelpers.deleteFile(file?.path!);
        return res.status(400).json({
          status: 400,
          message: "File upload requires folder id",
          key: "folder",
        });
      }
      if (!MongoIdValidator.isValid(folder)) {
        FIleHelpers.deleteFile(file?.path!);
        return res.status(400).json({
          status: 400,
          message: "Folder id is invalid",
          key: "folder",
        });
      }
      if (!(await folderModel.findById(folder))) {
        FIleHelpers.deleteFile(file?.path!);
        return res.status(400).json({
          status: 400,
          message: "Folder Does not exist",
          key: "folder",
        });
      }

      const newImage: IMediaFile = {
        encoding: file?.encoding!,
        fileName: file?.filename!,
        folder: folder,
        mimetype: file?.mimetype as any,
        originalName: file?.originalname!,
        path: "/images/" + file?.filename,
        size: file?.size!,
        type: "image",
      };

      const createdImage = await mediafileModel.create(newImage);
      return res.status(201).json(createdImage);
    } catch (err: any) {
      return next(err);
    }
  }
}

export default new ImageUploadController();
