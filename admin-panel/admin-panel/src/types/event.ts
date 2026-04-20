export type AdminEvent = {
  id: string;
  title: string;
  date: string;
  dateISO?: string;
  location: string;
  image: string;
  description: string;
  latitude: number;
  longitude: number;
  approved: boolean;
};

export type EventUpdate = Partial<Omit<AdminEvent, "id">>;

export type NewEventInput = Omit<AdminEvent, "id" | "approved"> & {
  dateISO: string;
};
