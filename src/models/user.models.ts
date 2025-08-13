import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "student" | "teacher" | "parent";
  refreshToken: string;
  verified: boolean;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
  gender?: "male" | "female";
  profileImage?: string;
  otp: number;
  otpExpires: Date;
  studentDetails?: {
    enrollmentNumber: string;
    grade: string;
    section?: string;
    guardianId?: mongoose.Types.ObjectId;
  };
  teacherDetails?: {
    employeeId: string;
    subjectSpecialization: string[];
    joiningDate: Date;
  };
  parentDetails?: {
    childrenIds: mongoose.Types.ObjectId[];
    occupation?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name cannot exceed 50 characters"]
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
      maxlength: [50, "Last name cannot exceed 50 characters"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    role: {
      type: String,
      enum: ["student", "teacher", "parent"],
      required: [true, "Role is required"]
    },
    refreshToken: String,
    verified: {
      type: Boolean,
      default: false
    },
    otp: Number,
    otpExpires: Date,
    phone: {
      type: String,
      match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"],
      default: null
    },
    address: {
      type: String,
      trim: true,
      default: null
    },
    dateOfBirth: {
      type: Date,
      validate: {
        validator: (value: Date) => value <= new Date(),
        message: "Date of birth cannot be in the future"
      }
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: null
    },
    profileImage: {
      type: String,
      default: null
    },
    studentDetails: {
      enrollmentNumber: { type: String, trim: true },
      grade: { type: String, trim: true },
      section: { type: String, trim: true },
      guardianId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    },
    teacherDetails: {
      employeeId: { type: String, trim: true },
      subjectSpecialization: [{ type: String, trim: true }],
      joiningDate: { type: Date }
    },
    parentDetails: {
      childrenIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      occupation: { type: String, trim: true }
    }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);