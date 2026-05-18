import mongoose, { Schema, type Document, type Types } from "mongoose";

export interface IAdminWilaya extends Document {
  full_name: string;
  email: string;
  password: string;
  status: "active" | "inactive" | "suspended";
  image?: Buffer;
  image_mimetype?: string;
  nin: string;
  phone: string;
  wilaya: Types.ObjectId;
  created_by: Types.ObjectId;
}

const adminWilayaSchema = new Schema<IAdminWilaya>(
  {
    full_name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
    password: { type: String, required: true, select: false, minlength: 8 },
    status: { type: String, enum: ["active", "inactive", "suspended"], default: "active" },
    image: { type: Buffer, select: false },
    image_mimetype: { type: String, select: false },
    nin: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, required: true, trim: true },
    wilaya: { type: Schema.Types.ObjectId, ref: "Wilaya", required: true },
    created_by: { type: Schema.Types.ObjectId, ref: "SuperAdmin" },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        delete ret.image;
        delete ret.image_mimetype;
      },
    },
  }
);

adminWilayaSchema.index({ wilaya: 1, status: 1 });

export const AdminWilaya = mongoose.model<IAdminWilaya>("AdminWilaya", adminWilayaSchema);
