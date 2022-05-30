import { mongoose } from "mongoose";

const { Schema } = mongoose;

const profileSchema = new Schema(
  {
    profileImage: {
      type: String,
      required: true,
      default:
        "https://avatars.dicebear.com/api/micah/defaultname.svg?mood[]=happy&mood[]=happy&background=%23e8e8e8",
    },
    title: {
      type: String,
      required: [true, "A title is required"],
    },
    fullName: {
      type: String,
      required: [true, "Firstname is required"],
    },
    bio: {
      type: String,
    },
    tags: {
      type: [String],
    },
    linkLinkdIn: {
      type: String,
    },
    linkPortfolio: {
      type: String,
    },
    like: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "You need a username"],
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Password must be at least 8 characters long"],
    },
  },
  { timestamps: true }
);

export const models = [
  {
    name: "Profile",
    schema: profileSchema,
    collection: "profiles",
  },
  {
    name: "User",
    schema: userSchema,
    collection: "users",
  },
];
