import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose";

const pinSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    imageUrl: { type: String, required: true },
    width: { type: Number, default: 600 },
    height: { type: Number, default: 800 },
    category: { type: String, default: "Design", index: true },
    tags: { type: [String], default: [] },
    link: { type: String, default: "" },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    saves: [{ type: Schema.Types.ObjectId, ref: "User", index: true }],
  },
  { timestamps: true },
);

pinSchema.index({ title: "text", description: "text", tags: "text" });

pinSchema.set("toJSON", {
  transform(_doc, ret: Record<string, unknown>) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export type PinShape = InferSchemaType<typeof pinSchema>;
export type PinDoc = HydratedDocument<PinShape>;
export const Pin = model("Pin", pinSchema);
