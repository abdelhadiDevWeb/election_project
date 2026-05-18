import mongoose, { Schema, type Document } from "mongoose";

export interface ISuperAdmin extends Document {
  full_name: string;
  email: string;
  password: string;
  status: "active" | "inactive" | "suspended";
  image?: Buffer;
  image_mimetype?: string;
  phone: string;
  nin: string;
}

const superAdminSchema = new Schema<ISuperAdmin>(
  {
    full_name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
    password: { type: String, required: true, select: false, minlength: 8 },
    status: { type: String, enum: ["active", "inactive", "suspended"], default: "active" },
    image: { type: Buffer, select: false },
    image_mimetype: { type: String, select: false },
    phone: { type: String, required: true, trim: true },
    nin: { type: String, required: true, unique: true, trim: true },
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

export const SuperAdmin = mongoose.model<ISuperAdmin>("SuperAdmin", superAdminSchema);
