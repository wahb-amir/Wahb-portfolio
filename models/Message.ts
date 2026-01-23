import mongoose, { Document, Model, Schema } from "mongoose";

// --- TypeScript interface for a message document
export interface MessageDoc extends Document {
  name: string;
  email: string;
  interest: string;
  createdAt: Date;
  updatedAt: Date;
}

// --- Mongoose schema
const MessageSchema: Schema<MessageDoc> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    interest: { type: String, required: true },
  },
  { timestamps: true }
);

// --- Export model
const Message: Model<MessageDoc> =
  mongoose.models.Message ||
  mongoose.model<MessageDoc>("Message", MessageSchema);

export default Message;
