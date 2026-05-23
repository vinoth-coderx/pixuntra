import { Schema, model, type InferSchemaType, type HydratedDocument } from "mongoose";

const sessionSchema = new Schema(
  {
    token: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type SessionShape = InferSchemaType<typeof sessionSchema>;
export type SessionDoc = HydratedDocument<SessionShape>;
export const Session = model("Session", sessionSchema);
