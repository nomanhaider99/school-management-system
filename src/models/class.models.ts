import mongoose, { Schema, Document } from "mongoose";

export interface IClass extends Document {
  name: string;
  grade: number;
  section: string;
  classTeacher: mongoose.Types.ObjectId; 
  students: mongoose.Types.ObjectId[]; 
  subjects: string[];
  timetable: mongoose.Types.ObjectId; 
}

const ClassSchema = new Schema<IClass>(
  {
    name: {
      type: String,
      required: [true, "Class name is required"],
      trim: true,
      minlength: [3, "Class name must be at least 3 characters long"],
    },
    grade: {
      type: Number,
      required: [true, "Grade is required"],
      min: [1, "Grade cannot be less than 1"],
      max: [12, "Grade cannot be more than 12"],
    },
    section: {
      type: String,
      required: [true, "Section is required"],
      trim: true,
      maxlength: [1, "Section should be a single letter (A, B, C, etc.)"],
      match: [/^[A-Z]$/, "Section must be a single uppercase letter"],
    },
    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Class teacher is required"],
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    subjects: {
      type: [String],
      validate: {
        validator: function (arr: string[]) {
          return arr.length > 0;
        },
        message: "At least one subject must be added",
      },
    },
    timetable: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Timetable",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Class ||
  mongoose.model<IClass>("Class", ClassSchema);
