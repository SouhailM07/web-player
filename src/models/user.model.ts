import { Schema, model } from "mongoose";

const userSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
});

let User;

try {
  User = model("User");
} catch (error) {
  User = model("User", userSchema);
}

export default User;
