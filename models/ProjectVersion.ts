import mongoose, { Document, Model, Schema } from "mongoose";

// --- TypeScript interfaces
export interface Project extends Document {
  id: string;
  title: string;
  role: string;
  images: string[];
  tech: string[];
  short: string;
  liveLink: string;
  githubLink: string[];
  problem: string;
  process: string[];
  outcome: string;
  stats: any;
  category: string;
}

export interface ProjectVersionDoc extends Document {
  version: number;
  projects: Project[];
  createdAt: Date;
  updatedAt: Date;
}

// --- Project schema
const projectSchema = new Schema<Project>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    role: { type: String, required: true },
    images: { type: [String], default: [] },
    tech: { type: [String], default: [] },
    short: { type: String, required: true },
    liveLink: { type: String, required: true },
    githubLink: { type: [String], default: [] },
    problem: { type: String, required: true },
    process: { type: [String], default: [] },
    outcome: { type: String, required: true },
    stats: { type: Schema.Types.Mixed, default: {} },
    category: { type: String, required: true },
  },
  { _id: false } // prevent _id generation for subdocuments if desired
);

// --- ProjectVersion schema
const projectVersionSchema = new Schema<ProjectVersionDoc>(
  {
    version: { type: Number, required: true, unique: true },
    projects: { type: [projectSchema], default: [] },
  },
  { timestamps: true }
);

// --- Export model
const ProjectVersion: Model<ProjectVersionDoc> =
  mongoose.models.ProjectVersion ||
  mongoose.model<ProjectVersionDoc>("ProjectVersion", projectVersionSchema);

export default ProjectVersion;
