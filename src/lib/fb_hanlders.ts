import { storage } from "@/firebase";

import {
  getDownloadURL,
  deleteObject,
  ref,
  uploadBytes,
} from "firebase/storage";
import { v4 } from "uuid";
import handleError from "./handleError";

export const uploadAudio = async (media) => {
  try {
    if (!media) return null;
    const mediaName: string = `audio/${media.name + v4()}`;
    const mediaRef = ref(storage, mediaName);
    //
    await uploadBytes(mediaRef, media);
    const downloadURL = await getDownloadURL(mediaRef);
    return { mediaName, downloadURL };
  } catch (error) {
    handleError(error);
    return null;
  }
};

export const deleteAudio = async (deleteRef) => {
  await deleteObject(deleteRef)
    .then(() => console.log("audio was deleted"))
    .catch((err) => handleError(err));
};
