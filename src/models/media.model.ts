import { Schema, model } from "mongoose";

const mediaSchema = new Schema({
  mediaName: { type: String, required: true },
  mediaSrc: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

let Media;

try {
  Media = model("Media");
} catch (error) {
  Media = model("Media", mediaSchema);
}

export default Media;
