import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";

function getExt(fileName: string) {
  const parts = fileName.split(".");
  if (parts.length < 2) return "png";
  const ext = parts[parts.length - 1].toLowerCase();
  // Keep it simple/safe; only allow common image extensions.
  if (["png", "jpg", "jpeg", "webp", "gif"].includes(ext)) return ext;
  return "png";
}

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `evt_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export async function uploadEventImage(file: File): Promise<string> {
  const ext = getExt(file.name);
  const id = makeId();
  const storageRef = ref(storage, `event-images/${id}.${ext}`);
  await uploadBytes(storageRef, file, {
    contentType: file.type || `image/${ext}`,
  });
  return getDownloadURL(storageRef);
}

