import { Router } from "express";
import folderController from "@/controller/folder.controller";

const router = Router();

router.get("/", folderController.test);
router.post("/create", folderController.createFolder);
router.get("/all", folderController.getAllFolders);
router.get("/get/:folderId/files", folderController.getFolderFiles);


export default router;
