import mongoose, { Document, Model, Schema } from "mongoose";

interface TimelineItem {
  title: string;
  desc: string;
}

interface About {
  bio: string;
  quickFacts: string[];
  timeline: TimelineItem[];
}

interface AboutVersionDoc extends Document {
  version: number;
  about: About;
}

// --- Timeline item schema
const timelineItemSchema = new Schema<TimelineItem>({
  title: { type: String, required: true },
  desc: { type: String, required: true },
});

// --- About section schema
const aboutSchema = new Schema<About>({
  bio: { type: String, required: true },
  quickFacts: { type: [String], default: [] },
  timeline: { type: [timelineItemSchema], default: [] },
});

// --- Versioned About document schema
const aboutVersionSchema = new Schema<AboutVersionDoc>(
  {
    version: { type: Number, required: true, unique: true },
    about: aboutSchema,
  },
  { timestamps: true } // createdAt, updatedAt
);

// --- Export model
const AboutVersion: Model<AboutVersionDoc> =
  mongoose.models.AboutVersion ||
  mongoose.model<AboutVersionDoc>("AboutVersion", aboutVersionSchema);

export default AboutVersion;
