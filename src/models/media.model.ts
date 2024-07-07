import { Schema, model } from "mongoose";

const mediaSchema = new Schema({
  mediaName: { type: String, required: true },
  mediaSrc: { type: String, required: true },
  user: { type: String, required: true },
  customName: { type: String },
});
mediaSchema.pre("save", function (next) {
  if (!this.customName) {
    this.customName = this.mediaName;
  }
  next();
});
let Media;

try {
  Media = model("Media");
} catch (error) {
  Media = model("Media", mediaSchema);
}

export default Media;
