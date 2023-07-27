import { pathConfig } from "@/config";
import { FIleHelpers } from "@/helpers/file-helpers";
import MongoIdValidator from "@/helpers/mongo-id";
import { paginator } from "@/helpers/paginator";
import folderModel from "@/models/folder.model";
import mediafileModel, { IMediaFile } from "@/models/mediafile.model";
import { AppNext, AppRequest, AppResponse } from "@/type";
import fs from "node:fs";

class ImageUploadController {
  async test(_req: AppRequest, res: AppResponse, next: AppNext) {
    try {
      return res.status(200).json({ message: "Image endpoint working" });
    } catch (err: any) {
      return next(err);
    }
  }
  // Get all images
  async getAllImages(req: AppRequest, res: AppResponse, next: AppNext) {
    try {
      const query = req.query;
      const limit = query.limit ? parseInt(query.limit as string) : 20;
      const page = query.page ? parseInt(query.page as string) : 1;
      const totalDocs = await mediafileModel.countDocuments({});
      const images = await mediafileModel

        .find({})
        .skip(limit * (page - 1))
        .limit(limit)
        .populate("folder", "name");
      return res
        .status(200)
        .json(paginator({ data: images, page, limit, totalDocs }));
    } catch (error) {
      return next(error);
    }
  }
  // Stream single image
  async streamSingleImage(req: AppRequest, res: AppResponse, next: AppNext) {
    try {
      const { imageId } = req.params;
      if (!imageId) {
        return res.status(400).json({
          status: 400,
          message: "Image id required",
          key: "imageId",
        });
      }
      if (imageId) {
        if (!MongoIdValidator.isValid(imageId)) {
          return res.status(400).json({
            status: 400,
            message: "Image id not valid",
            key: "image",
          });
        }
      }
      const image = await mediafileModel.findById(imageId);

      if (!image) {
        return res.status(404).json({
          status: 404,
          message: "Image not found",
          key: "image",
        });
      }
      const filePath = FIleHelpers.getFullFilePath(image?.path!);
      const fileStream = fs.createReadStream(filePath, {
        highWaterMark: 1024 * 1024 * 10, // 10MB chunks
      });
      return fileStream.pipe(res).on("error", (err) => {
        return next(err);
      });
    } catch (err: any) {
      return next(err);
    }
  }
  // Get image by id
  async getImageById(req: AppRequest, res: AppResponse, next: AppNext) {
    try {
      const { imageId } = req.params;
      if (!imageId) {
        return res.status(400).json({
          status: 400,
          message: "Image id required",
          key: "imageId",
        });
      }
      if (imageId) {
        if (!MongoIdValidator.isValid(imageId)) {
          return res.status(400).json({
            status: 400,
            message: "Image id not valid",
            key: "image",
          });
        }
      }
      const image = await mediafileModel.findById(imageId);
      if (!image) {
        return res.status(404).json({
          status: 404,
          message: "Image not found",
          key: "image",
        });
      }
      return res.status(200).json(image);
    } catch (err: any) {
      return next(err);
    }
  }
  // Upload image
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
      const fileFullPath = FIleHelpers.normalizeFilePath(file?.path!);

      const newImage: IMediaFile = {
        encoding: file?.encoding!,
        fileName: file?.filename!,
        folder: folder,
        mimetype: file?.mimetype as any,
        originalName: file?.originalname!,
        path: FIleHelpers.getFilePathChunks(fileFullPath)[1],
        size: file?.size!,
        type: "image",
      };

      const createdImage = await mediafileModel.create(newImage);
      return res.status(201).json(createdImage);
    } catch (err: any) {
      return next(err);
    }
  }
  // Rename image
  async renameImage(req: AppRequest, res: AppResponse, next: AppNext) {
    try {
      const { imageId } = req.params;
      const { name } = req.body;
      if (!imageId) {
        return res.status(400).json({
          status: 400,
          message: "Image id required",
          key: "imageId",
        });
      }
      if (imageId) {
        if (!MongoIdValidator.isValid(imageId)) {
          return res.status(400).json({
            status: 400,
            message: "Image id not valid",
            key: "image",
          });
        }
      }
      if (!name) {
        return res.status(400).json({
          status: 400,
          message: "Image name required",
          key: "name",
        });
      }
      const image = await mediafileModel.findById(imageId);
      if (!image) {
        return res.status(404).json({
          status: 404,
          message: "Image not found",
          key: "image",
        });
      }
      const updatedImage = await mediafileModel.findByIdAndUpdate(
        imageId,
        { originalName: name + FIleHelpers.getFileExtension(image.fileName!) },
        { new: true }
      );
      return res.status(200).json(updatedImage);
    } catch (err: any) {
      return next(err);
    }
  }
  // Move image to another folder
  async moveImageToAnotherFolder(
    req: AppRequest,
    res: AppResponse,
    next: AppNext
  ) {
    try {
      const { imageId } = req.params;
      const { folderId } = req.body;
      if (!imageId) {
        return res.status(400).json({
          status: 400,
          message: "Image id required",
          key: "imageId",
        });
      }
      if (imageId) {
        if (!MongoIdValidator.isValid(imageId)) {
          return res.status(400).json({
            status: 400,
            message: "Image id not valid",
            key: "image",
          });
        }
      }
      if (!folderId) {
        return res.status(400).json({
          status: 400,
          message: "Folder id required",
          key: "folderId",
        });
      }
      if (folderId) {
        if (!MongoIdValidator.isValid(folderId)) {
          return res.status(400).json({
            status: 400,
            message: "Folder id not valid",
            key: "folder",
          });
        }
      }
      const image = await mediafileModel.findById(imageId);
      if (!image) {
        return res.status(404).json({
          status: 404,
          message: "Image not found",
          key: "image",
        });
      }
      const folder = await folderModel.findById(folderId);
      if (!folder) {
        return res.status(404).json({
          status: 404,
          message: "Folder not found",
          key: "folder",
        });
      }
      const updatedImage = await mediafileModel.findByIdAndUpdate(
        imageId,
        { folder: folderId },
        { new: true }
      );
      return res.status(200).json(updatedImage);
    } catch (error: any) {
      return next(error);
    }
  }
  // Download image
  async downloadImage(req: AppRequest, res: AppResponse, next: AppNext) {
    try {
      const { imageId } = req.params;
      if (!imageId) {
        return res.status(400).json({
          status: 400,
          message: "Image id required",
          key: "imageId",
        });
      }
      if (imageId) {
        if (!MongoIdValidator.isValid(imageId)) {
          return res.status(400).json({
            status: 400,
            message: "Image id not valid",
            key: "image",
          });
        }
      }
      const image = await mediafileModel.findById(imageId);
      if (!image) {
        return res.status(404).json({
          status: 404,
          message: "Image not found",
          key: "image",
        });
      }
      const filePath = FIleHelpers.getFullFilePath(image?.path!);
      return res.download(filePath, image?.fileName!, (err) => {
        if (err) {
          return next(err);
        }
      });
    } catch (error: any) {
      return next(error);
    }
  }
  // Delete image
  async deleteImage(req: AppRequest, res: AppResponse, next: AppNext) {
    try {
      const { imageId } = req.params;
      if (!imageId) {
        return res.status(400).json({
          status: 400,
          message: "Image id required",
          key: "imageId",
        });
      }
      if (imageId) {
        if (!MongoIdValidator.isValid(imageId)) {
          return res.status(400).json({
            status: 400,
            message: "Image id not valid",
            key: "image",
          });
        }
      }
      const image = await mediafileModel.findById(imageId);
      if (!image) {
        return res.status(404).json({
          status: 404,
          message: "Image not found",
          key: "image",
        });
      }
      const filePath = FIleHelpers.getFullFilePath(image?.path!);
      FIleHelpers.deleteFile(filePath);
      await mediafileModel.findByIdAndDelete(imageId);
      return res.status(200).json({
        status: 200,
        message: "Image deleted successfully",
      });
    } catch (error: any) {
      return next(error);
    }
  }
  // Copy image to another folder
  async copyImageToAnotherFolder(
    req: AppRequest,
    res: AppResponse,
    next: AppNext
  ) {
    // TODO: Implement copy image to another folder
    try {
      const { imageId } = req.params;
      const { folderId } = req.body;
      if (!imageId) {
        return res.status(400).json({
          status: 400,
          message: "Image id required",
          key: "imageId",
        });
      }
      if (imageId) {
        if (!MongoIdValidator.isValid(imageId)) {
          return res.status(400).json({
            status: 400,
            message: "Image id not valid",
            key: "image",
          });
        }
      }
      if (!folderId) {
        return res.status(400).json({
          status: 400,
          message: "Folder id required",
          key: "folderId",
        });
      }
      if (folderId) {
        if (!MongoIdValidator.isValid(folderId)) {
          return res.status(400).json({
            status: 400,
            message: "Folder id not valid",
            key: "folder",
          });
        }
      }

      const image = await mediafileModel.findById(imageId)
      if (!image) {
        return res.status(404).json({
          status: 404,
          message: "Image not found",
          key: "image",
        });
      }
      const folder = await folderModel.findById(folderId);
      if (!folder) {
        return res.status(404).json({
          status: 404,
          message: "Folder not found",
          key: "folder",
        });
      }
      
      if (image._doc.folder.toString() == folderId) {
        return res.status(400).json({
          status: 400,
          message: "Image already in this folder",
          key: "folder",
        });
      }
      const fileFullPath = FIleHelpers.normalizeFilePath(
        FIleHelpers.getFullFilePath(image.path!)
      );
      const newFileStream = fs.createReadStream(fileFullPath);
      const fileName = FIleHelpers.generateFileName(image.fileName!);
      const newFilePath = pathConfig.uploadDir + "/images/" + fileName;
      const newImage: IMediaFile = {
        ...image._doc,
        fileName: fileName,
        path: FIleHelpers.getFilePathChunks(newFilePath)[1],
        folder: folderId,
        _id: undefined,
      } as any;
      newFileStream
        .pipe(fs.createWriteStream(newFilePath))
        .on("error", (err) => {
          return next(err);
        })
        .on("finish", async () => {
          const createdImage = await mediafileModel.create(newImage);
          return res.status(201).json(createdImage);
        });
    } catch (error: any) {
      return next(error);
    }
  }
}

export default new ImageUploadController();
