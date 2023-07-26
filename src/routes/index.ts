import { Router } from "express";
import images from "@/routes/image.routes";
import folders from "./folder.routes";

export default function appRoutes() {
  const router = Router();
  router.use("/images", images);
  router.use("/folders", folders);
  return router;
}
