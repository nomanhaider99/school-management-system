import mongoose, { Schema, Document } from "mongoose";

export interface ISubject extends Document {
  name: string;
  description?: string;
  classId: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
}

const SubjectSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
      minlength: [2, "Subject name must be at least 2 characters long"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description can't exceed 200 characters"],
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: [true, "Class ID is required"],
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Teacher ID is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Subject ||
  mongoose.model<ISubject>("Subject", SubjectSchema);
