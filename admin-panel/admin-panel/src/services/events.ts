import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import type { AdminEvent, EventUpdate } from "../types/event";
import type { NewEventInput } from "../types/event";

const EVENTS_COLLECTION = "events";

export async function fetchAllEvents(): Promise<AdminEvent[]> {
  // Prefer stable sorting by dateISO if present, fall back to date string otherwise.
  // (Firestore cannot do conditional orderBy, so we expect dateISO for newly created events.)
  const q = query(collection(db, EVENTS_COLLECTION), orderBy("dateISO", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data() as Record<string, unknown>;
    return {
      id: d.id,
      title: String(data.title ?? ""),
      date: String(data.date ?? ""),
      dateISO: data.dateISO ? String(data.dateISO) : undefined,
      location: String(data.location ?? ""),
      image: String(data.image ?? ""),
      description: String(data.description ?? ""),
      latitude: Number(data.latitude ?? 0),
      longitude: Number(data.longitude ?? 0),
      approved: Boolean(data.approved ?? false),
    };
  });
}

export async function approveEvent(eventId: string): Promise<void> {
  await updateDoc(doc(db, EVENTS_COLLECTION, eventId), { approved: true });
}

export async function deleteEvent(eventId: string): Promise<void> {
  await deleteDoc(doc(db, EVENTS_COLLECTION, eventId));
}

export async function updateEvent(eventId: string, update: EventUpdate): Promise<void> {
  await updateDoc(doc(db, EVENTS_COLLECTION, eventId), update);
}

export async function addEvent(eventInput: NewEventInput): Promise<string> {
  const docRef = await addDoc(collection(db, EVENTS_COLLECTION), {
    ...eventInput,
    approved: false,
  });
  return docRef.id;
}
