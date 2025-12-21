import mongoose, { Document, Model, Schema } from "mongoose";

/* ============================
   TypeScript interfaces
   ============================ */

export interface CaseStudy {
  tlDr?: string;
  problem?: string;
  constraints?: string;
  myRole?: string;
  responsibilities?: string[];
  approach?: string[];
  technicalSolution?: string[];
  architectureNotes?: string;
  outcomes?: {
    qualitative?: string;
    [k: string]: any;
  };
  proofPoints?: string[];
  lessons?: string[];
  callToAction?: string;
  [k: string]: any;
}

export interface Project {
  id?: string;
  title: string;
  role?: string;
  images?: string[];
  tech?: string[];
  short?: string;
  liveLink?: string;
  githubLink?: string[];
  problem?: string;
  process?: string[];
  outcome?: string;
  // Mongoose returns Map instances for Map schema type; allow either
  stats?: Record<string, string> | Map<string, string>;
  category?: string;
  launch?: {
    date?: string;
  };
  caseStudy?: CaseStudy;
  [k: string]: any;
}

export interface ProjectVersionDoc extends Document {
  version: number;
  projects: Project[];
  createdAt: Date;
  updatedAt: Date;
}

/* ============================
   Sub-schemas (Mongoose)
   ============================ */

// CaseStudy sub-schema (no _id)
const caseStudySchema = new Schema<CaseStudy>(
  {
    tlDr: { type: String },
    problem: { type: String },
    constraints: { type: String },
    myRole: { type: String },
    responsibilities: { type: [String], default: [] },
    approach: { type: [String], default: [] },
    technicalSolution: { type: [String], default: [] },
    architectureNotes: { type: String },
    outcomes: {
      type: {
        qualitative: { type: String },
      },
      default: {},
      _id: false,
    },
    proofPoints: { type: [String], default: [] },
    lessons: { type: [String], default: [] },
    callToAction: { type: String },
  },
  { _id: false }
);

/* ============================
   Project schema
   ============================ */

const projectSchema = new Schema<Project>(
  {
    id: { type: String },
    title: { type: String, required: true },

    role: { type: String },
    images: { type: [String], default: [] },
    tech: { type: [String], default: [] },

    short: { type: String },
    liveLink: { type: String },
    githubLink: { type: [String], default: [] },

    problem: { type: String },
    process: { type: [String], default: [] },
    outcome: { type: String },

    stats: {
      type: Map,
      of: String,
      default: {},
    },

    launch: {
      date: { type: String },
    },

    category: { type: String },

    caseStudy: { type: caseStudySchema, default: undefined },
  },
  { _id: false }
);

/* ============================
   ProjectVersion schema + model
   ============================ */

const projectVersionSchema = new Schema<ProjectVersionDoc>(
  {
    version: { type: Number, required: true, unique: true },
    projects: { type: [projectSchema], default: [] },
  },
  { timestamps: true }
);

const ProjectVersion: Model<ProjectVersionDoc> =
  mongoose.models.ProjectVersion ||
  mongoose.model<ProjectVersionDoc>("ProjectVersion", projectVersionSchema);

export default ProjectVersion;
