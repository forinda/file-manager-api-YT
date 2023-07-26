import fs from "node:fs";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";

export class FIleHelpers {
  // Create folder
  public static createFolder(path: string) {
    return !fs.existsSync(path) && fs.mkdirSync(path, { recursive: true });
  }
  //   Delete file
  public static deleteFile(path: string) {
    if (fs.existsSync(path)) {
      try {
        console.log(`Deleting file:${path}`);

        fs.unlinkSync(path);
      } catch (error) {
        console.log(`Error deleting folder: ${error.message}`);
      }
    }
  }
  //   Check if file exist async
  public static async fileAsyncExist(path: string) {
    let exist = false;
    fs.access(path, async (err) => {
      if (err) {
        exist = false;
      } else {
        exist = true;
      }
    });
    return exist;
  }
  //   Check if file exist synchronousy
  public static fileExist(path: string) {
    return fs.existsSync(path);
  }

  //   Get file extension
  public static getFileExtension(filename: string) {
    return path.extname(filename).slice(1);
  }

  //   Generate file names from uuid
  public static generateFileName(filename: string) {
    return `${uuidv4()}.${FIleHelpers.getFileExtension(filename)}`;
  }
}
