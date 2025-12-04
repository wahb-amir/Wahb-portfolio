import mongoose from "mongoose";

// --- Timeline item schema
const timelineItemSchema = new mongoose.Schema({
    title: { type: String, required: true }, // e.g., "Early 2025"
    desc: { type: String, required: true },  // e.g., "Front-end foundations: HTML & CSS"
});

// --- About section schema
const aboutSchema = new mongoose.Schema({
    bio: { type: String, required: true },                   // Your main bio text
    quickFacts: { type: [String], default: [] },             // List of quick facts
    timeline: { type: [timelineItemSchema], default: [] },   // Learning/experience timeline
});

// --- Versioned About document schema
const aboutVersionSchema = new mongoose.Schema(
    {
        version: { type: Number, required: true, unique: true },
        about: aboutSchema,
    },
    { timestamps: true } // createdAt, updatedAt
);

// --- Export model
export default mongoose.models.AboutVersion ||
    mongoose.model("AboutVersion", aboutVersionSchema);
