import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    id: String,
    title: String,
    role: String,
    images: [String],
    tech: [String],
    short: String,
    liveLink: String,
    githubLink: [String],
    problem: String,
    process: [String],
    outcome: String,
    stats: mongoose.Schema.Types.Mixed,
    category: String,
});

const projectVersionSchema = new mongoose.Schema(
    {
        version: { type: Number, required: true, unique: true },
        projects: [projectSchema],
    },
    { timestamps: true }
);

export default mongoose.models.ProjectVersion ||
    mongoose.model("ProjectVersion", projectVersionSchema);