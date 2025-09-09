import { Schema, model, models } from "mongoose";
import { dbConnect } from "./mongoose";

export const MeetingStatus = ["scheduled", "recording", "complete", "archived"] as const;
export const TaskStatus = ["open", "in_progress", "blocked", "done", "archived"] as const;

const OrganizationSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, index: true, required: true },
  createdAt: { type: Date, default: Date.now }
});

const UserSchema = new Schema({
  orgId: { type: Schema.Types.ObjectId, ref: "Organization", index: true },
  email: { type: String, index: true },
  name: { type: String, required: true },
  role: { type: String, default: "member", index: true },
  createdAt: { type: Date, default: Date.now }
});

const ClientSchema = new Schema({
  orgId: { type: Schema.Types.ObjectId, ref: "Organization", index: true },
  name: String,
  contact: String,
  createdAt: { type: Date, default: Date.now }
});

const MeetingSchema = new Schema({
  orgId: { type: Schema.Types.ObjectId, ref: "Organization", index: true },
  title: { type: String, required: true },
  startTime: { type: Date, index: true },
  endTime: { type: Date },
  hostId: { type: Schema.Types.ObjectId, ref: "User", index: true },
  location: String,
  attendees: [{ type: Schema.Types.ObjectId, ref: "User" }],
  clientId: { type: Schema.Types.ObjectId, ref: "Client" },
  status: { type: String, enum: MeetingStatus, default: "scheduled", index: true },
  recordingId: { type: Schema.Types.ObjectId, ref: "Recording" },
  transcriptId: { type: Schema.Types.ObjectId, ref: "Transcript" },
  summaryId: { type: Schema.Types.ObjectId, ref: "Summary" },
  tags: [{ type: String }],
  retentionLocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const RecordingSchema = new Schema({
  meetingId: { type: Schema.Types.ObjectId, ref: "Meeting", index: true },
  storageKey: { type: String, required: true },
  url: String,
  mimeType: { type: String, default: "audio/webm" },
  bytes: Number,
  durationSec: Number,
  checksum: String,
  encrypted: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const TranscriptSchema = new Schema({
  meetingId: { type: Schema.Types.ObjectId, ref: "Meeting", index: true },
  provider: String,
  language: String,
  text: { type: String, default: "" },
  segments: { type: Schema.Types.Mixed },
  confidence: Number,
  createdAt: { type: Date, default: Date.now }
});

const SummarySchema = new Schema({
  meetingId: { type: Schema.Types.ObjectId, ref: "Meeting", index: true },
  model: String,
  promptHash: String,
  bullets: [String],
  risks: [String],
  decisions: [String],
  tasksExtracted: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

const TaskSchema = new Schema({
  orgId: { type: Schema.Types.ObjectId, ref: "Organization", index: true },
  meetingId: { type: Schema.Types.ObjectId, ref: "Meeting", index: true },
  title: { type: String, required: true },
  description: String,
  dueAt: Date,
  status: { type: String, enum: TaskStatus, default: "open", index: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

const TaskAssignmentSchema = new Schema({
  taskId: { type: Schema.Types.ObjectId, ref: "Task", index: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
  assignedAt: { type: Date, default: Date.now }
});

await dbConnect();

export const Organization = models.Organization || model("Organization", OrganizationSchema);
export const User = models.User || model("User", UserSchema);
export const Client = models.Client || model("Client", ClientSchema);
export const Meeting = models.Meeting || model("Meeting", MeetingSchema);
export const Recording = models.Recording || model("Recording", RecordingSchema);
export const Transcript = models.Transcript || model("Transcript", TranscriptSchema);
export const Summary = models.Summary || model("Summary", SummarySchema);
export const Task = models.Task || model("Task", TaskSchema);
export const TaskAssignment = models.TaskAssignment || model("TaskAssignment", TaskAssignmentSchema);
