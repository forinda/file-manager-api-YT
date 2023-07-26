import mongoose from "@/db";

export interface IFileFolder {
  name: string;
  parent: any; // UID representing the parent folder if any
  files: any[];
}

export interface IFileFolderDocument extends IFileFolder {
  _doc: IFileFolder;
}

export interface IFileFolderModel extends mongoose.Model<IFileFolderDocument> {}

const folderSchema = new mongoose.Schema<IFileFolderDocument>(
  {
    files: {
      type: [mongoose.SchemaTypes.ObjectId],
      ref: "mediaFile",
      default:[]
    },
    name: {
      type: String,
      required: [true, "Folder name is required"],
      unique: false,
    },
    parent: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "folder",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IFileFolderDocument, IFileFolderModel>(
  "folder",
  folderSchema
);
