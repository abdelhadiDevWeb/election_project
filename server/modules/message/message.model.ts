import mongoose, { Schema, type Document, type Types } from "mongoose";

export interface IMessage extends Document {
  content: string;
  sender: Types.ObjectId;
  sender_role: string;
  receivers: Types.ObjectId[];
  images: Buffer[];
  images_mimetypes: string[];
  video?: Buffer;
  video_mimetype?: string;
  pdf?: Buffer;
  pdf_mimetype?: string;
  read_by: Types.ObjectId[];
  sent_at: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    content: { type: String, required: true, trim: true, maxlength: 5000 },
    sender: { type: Schema.Types.ObjectId, required: true },
    sender_role: { type: String, required: true },
    receivers: [{ type: Schema.Types.ObjectId, required: true }],
    images: { type: [Buffer], default: [], select: false },
    images_mimetypes: { type: [String], default: [] },
    video: { type: Buffer, select: false },
    video_mimetype: { type: String },
    pdf: { type: Buffer, select: false },
    pdf_mimetype: { type: String },
    read_by: [{ type: Schema.Types.ObjectId }],
    sent_at: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { transform(_doc, ret: any) { ret.id = ret._id; delete ret._id; delete ret.__v; delete ret.images; delete ret.video; delete ret.pdf; } },
  }
);

messageSchema.index({ sender: 1, sent_at: -1 });
messageSchema.index({ receivers: 1, sent_at: -1 });

export const Message = mongoose.model<IMessage>("Message", messageSchema);
