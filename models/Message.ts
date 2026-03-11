import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
  name:      string;
  email:     string;
  interest:  string;
  budget:    string;
  timeline:  string;
  message:   string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    name: {
      type:     String,
      required: true,
      trim:     true,
      maxlength: 80,
    },
    email: {
      type:     String,
      required: true,
      trim:     true,
      lowercase: true,
      maxlength: 254,
    },
    interest: {
      type:     String,
      required: true,
      trim:     true,
      enum: [
        "Full-Stack Web Application",
        "Backend Development",
        "SEO Optimization",
        "E-commerce Store",
        "Custom Web Solution",
      ],
    },
    budget: {
      type:    String,
      trim:    true,
      default: "not-sure",
      enum: ["under-1k", "1k-3k", "3k-8k", "8k-plus", "not-sure"],
    },
    timeline: {
      type:    String,
      trim:    true,
      default: "flexible",
      enum: ["asap", "1-month", "1-3-months", "flexible"],
    },
    message: {
      type:      String,
      trim:      true,
      default:   "",
      maxlength: 2000,
    },
  },
  {
    timestamps: true, 
  }
);

// Prevent model re-compilation in Next.js hot-reload
const Message: Model<IMessage> =
  mongoose.models.Message ??
  mongoose.model<IMessage>("Message", MessageSchema);

export default Message;