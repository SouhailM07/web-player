import { Schema, model } from "mongoose";

const mediaSchema = new Schema({
  mediaName: { type: String, required: true },
  mediaSrc: { type: String, required: true },
  user: { type: String, required: true },
});

let Media;

try {
  Media = model("Media");
} catch (error) {
  Media = model("Media", mediaSchema);
}

export default Media;
