import MongoIdValidator from "@/helpers/mongo-id";
import folderModel, { IFileFolder } from "@/models/folder.model";
import mediafileModel from "@/models/mediafile.model";
import { AppNext, AppRequest, AppResponse } from "@/type";

class FolderController {
  async test(_req: AppRequest, res: AppResponse, next: AppNext) {
    try {
      return res.status(200).json({ message: "Folders endpoint working" });
    } catch (err: any) {
      return next(err);
    }
  }
  async getAllFolders(req: AppRequest, res: AppResponse, next: AppNext) {
    try {
      const query = req.query;
      const limit = query.limit ? parseInt(query.limit as string) : 20;
      const page = query.page ? parseInt(query.page as string) : 1;

      const folders = await folderModel
        .find({})
        .skip(limit * (page - 1))
        .limit(limit)
        .populate("parent", "name");
      return res.status(200).json(folders);
    } catch (error) {
      return next(error);
    }
  }
  async getFolderFiles(req: AppRequest, res: AppResponse, next: AppNext) {
    try {
      const query = req.query;
      const limit = query.limit ? parseInt(query.limit as string) : 20;
      const page = query.page ? parseInt(query.page as string) : 1;
      const { folderId } = req.params;
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
      const files = await mediafileModel
        .find({ folder: folderId })
        .skip(limit * (page - 1))
        .limit(limit);
      return res.status(200).json({files});
    } catch (error) {
      return next(error);
    }
  }
  async createFolder(req: AppRequest, res: AppResponse, next: AppNext) {
    try {
      let { name, parent } = req.body as Pick<IFileFolder, "name" | "parent">;
      if (!name) {
        const untitledCounts = await folderModel.countDocuments({
          name: { $regex: "untitled_folder", $options: "i" },
        });
        name = `untitled_folder_${untitledCounts + 1}`;
      }
      if (parent) {
        if (!MongoIdValidator.isValid(parent)) {
          return res.status(400).json({
            status: 400,
            message: "Parent folder invalid",
            key: "folder",
          });
        }
      }
      const existingFolder = await folderModel.findOne({ name });
      if (existingFolder) {
        const counts = folderModel.countDocuments({ name });
        name += "_" + counts + 1;
      }

      const createdFolder = parent
        ? await folderModel.create({ name, parent })
        : await folderModel.create({ name });
      return res.status(201).json(createdFolder);
    } catch (err: any) {
      return next(err);
    }
  }
}

export default new FolderController();
