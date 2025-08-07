// models/User.ts
import mongoose, { Schema, Document, Model } from "mongoose";

interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface BlockedUser {
  userId: mongoose.Schema.Types.ObjectId;
  username: string;
}

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  phone?: string;
  gender?: "Male" | "Female" | "Other";
  dateOfBirth?: Date;

  // Account Security
  twoFactorEnabled: boolean;
  loginSessions: { device: string; ip: string; lastLogin: Date }[];

  // Address & Shipping
  addresses: Address[];

  // Notifications & Preferences
  notifications: { email: boolean; sms: boolean; promotions: boolean };
  theme: "light" | "dark";
  language: string;

  // Orders & Payment Methods
  savedPaymentMethods: { cardType: string; last4: string }[];
  walletBalance: number;

  // Privacy & Data
  blockedUsers: BlockedUser[];
  accountStatus: "active" | "suspended" | "deleted";

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
    phone: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    dateOfBirth: { type: Date },

    // Account & Security
    twoFactorEnabled: { type: Boolean, default: false },
    loginSessions: [
      {
        device: String,
        ip: String,
        lastLogin: Date,
      },
    ],

    // Address & Shipping
    addresses: [
      {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        isDefault: { type: Boolean, default: false },
      },
    ],

    // Notifications & Preferences
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      promotions: { type: Boolean, default: true },
    },
    theme: { type: String, enum: ["light", "dark"], default: "light" },
    language: { type: String, default: "en" },

    // Orders & Payment Methods
    savedPaymentMethods: [
      {
        cardType: String,
        last4: String,
      },
    ],
    walletBalance: { type: Number, default: 0 },

    // Privacy & Data
    blockedUsers: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        username: String,
      },
    ],
    accountStatus: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active",
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
