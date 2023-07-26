import mongoose from "@/db";
import {
  AudioMimeTypes,
  ImageMimeTypes,
  VideoMimeType,
} from "@/type/mimetypes";

export interface IMediaFile {
  originalName: string;
  encoding: string;
  mimetype: VideoMimeType | ImageMimeTypes | AudioMimeTypes;
  path: string;
  size: number;
  type: "image" | "video" | "audio" | "archive";
  folder: any; //Folder UID
  fileName: string;
}

export interface IMediaFileDocument extends IMediaFile {
  _doc: IMediaFile;
}

export interface IMediaFileModel extends mongoose.Model<IMediaFileDocument> {}

const mediaFileSchema = new mongoose.Schema<IMediaFileDocument>(
  {
    folder: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "folder",
    },
    fileName: {
      type: String,
      required: [true, "Folder name is required"],
      unique: false,
    },
    originalName: {
      type: String,
      required: [false, "Original name required"],
    },
    encoding: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      // enum:
      required: true,
    },
    type: {
      type: String,
      enum: ["audio", "image", "video", "archive"],
      required: [true, "File type required"],
    },
    size: {
      type: Number,
      required: [true, "File size required"],
    },
    path: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMediaFileDocument, IMediaFileModel>(
  "mediaFile",
  mediaFileSchema
);
