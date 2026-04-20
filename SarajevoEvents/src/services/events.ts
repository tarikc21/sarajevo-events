import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { FirestoreEvent, SarajevoEvent } from "@/types/event";

const EVENTS_COLLECTION = "events";

function toSarajevoEvent(id: string, data: DocumentData): SarajevoEvent {
  const type = (data.type ?? "concert") as SarajevoEvent["type"];
  const dateISO = (data.dateISO ?? "") as string;
  const isTonight = dateISO === "2026-03-30";

  return {
    id,
    title: String(data.title ?? ""),
    date: String(data.date ?? ""),
    dateISO,
    location: String(data.location ?? ""),
    description: String(data.description ?? ""),
    image: String(data.image ?? ""),
    type,
    coordinates: {
      latitude: Number(data.latitude ?? 0),
      longitude: Number(data.longitude ?? 0),
    },
    isTonight,
  };
}

export async function fetchEvents(): Promise<SarajevoEvent[]> {
  const q = query(collection(db, EVENTS_COLLECTION), where("approved", "==", true));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => toSarajevoEvent(doc.id, doc.data()));
}

export async function addEvent(event: Omit<FirestoreEvent, "approved">): Promise<string> {
  const docRef = await addDoc(collection(db, EVENTS_COLLECTION), {
    ...event,
    approved: false,
  });
  return docRef.id;
}
