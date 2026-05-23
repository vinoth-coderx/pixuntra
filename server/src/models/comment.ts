import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose";

const commentSchema = new Schema(
  {
    pin: { type: Schema.Types.ObjectId, ref: "Pin", required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { timestamps: true },
);

commentSchema.set("toJSON", {
  transform(_doc, ret: Record<string, unknown>) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export type CommentShape = InferSchemaType<typeof commentSchema>;
export type CommentDoc = HydratedDocument<CommentShape>;
export const Comment = model("Comment", commentSchema);
