export type EventType = "club" | "concert" | "festival";

export type SarajevoEvent = {
  id: string;
  title: string;
  date: string;
  dateISO: string;
  location: string;
  description: string;
  image: string;
  type: EventType;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  isTonight?: boolean;
};

export type FirestoreEvent = {
  title: string;
  date: string;
  location: string;
  image: string;
  description: string;
  latitude: number;
  longitude: number;
  approved: boolean;
  type?: EventType;
  dateISO?: string;
};
