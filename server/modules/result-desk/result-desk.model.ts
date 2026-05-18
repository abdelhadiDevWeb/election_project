import mongoose, { Schema, type Document, type Types } from "mongoose";

export type ResultStatus = "pending" | "ocr_done" | "ocr_human_done" | "rejected";

export interface IResultDesk extends Document {
  owner: Types.ObjectId;
  party: Types.ObjectId;
  desk: Types.ObjectId;
  candidat: Types.ObjectId;
  total: number;
  image?: Buffer;
  image_mimetype?: string;
  status: ResultStatus;
  ocr_result?: string;
  none_ocr: boolean;
}

const resultDeskSchema = new Schema<IResultDesk>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "RoleElectionDay", required: true },
    party: { type: Schema.Types.ObjectId, ref: "Party", required: true },
    desk: { type: Schema.Types.ObjectId, ref: "Desk", required: true },
    candidat: { type: Schema.Types.ObjectId, ref: "Candidat", required: true },
    total: { type: Number, required: true, min: 0 },
    image: { type: Buffer, select: false },
    image_mimetype: { type: String, select: false },
    status: {
      type: String,
      enum: ["pending", "ocr_done", "ocr_human_done", "rejected"],
      default: "pending",
    },
    ocr_result: { type: String },
    none_ocr: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.image;
        delete ret.image_mimetype;
      },
    },
  }
);

resultDeskSchema.index({ desk: 1, party: 1, candidat: 1 }, { unique: true });
resultDeskSchema.index({ status: 1, createdAt: -1 });
resultDeskSchema.index({ owner: 1 });

export const ResultDesk = mongoose.model<IResultDesk>("ResultDesk", resultDeskSchema);
