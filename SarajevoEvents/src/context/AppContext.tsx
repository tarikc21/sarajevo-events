import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { EventType, SarajevoEvent } from "@/types/event";
import { fetchEvents } from "@/services/events";

type AppContextValue = {
  events: SarajevoEvent[];
  favorites: string[];
  selectedDate: string | null;
  selectedType: EventType | "all";
  loadingEvents: boolean;
  eventsError: string | null;
  refreshEvents: () => Promise<void>;
  toggleFavorite: (eventId: string) => void;
  isFavorite: (eventId: string) => boolean;
  setSelectedDate: (date: string | null) => void;
  setSelectedType: (type: EventType | "all") => void;
  filteredEvents: SarajevoEvent[];
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: PropsWithChildren) {
  const [events, setEvents] = useState<SarajevoEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<EventType | "all">("all");

  const refreshEvents = async () => {
    setLoadingEvents(true);
    setEventsError(null);
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to load events.";
      setEventsError(message);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    void refreshEvents();
  }, []);

  const toggleFavorite = (eventId: string) => {
    setFavorites((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  const isFavorite = (eventId: string) => favorites.includes(eventId);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const dateOk = selectedDate ? event.dateISO === selectedDate : true;
      const typeOk = selectedType === "all" ? true : event.type === selectedType;
      return dateOk && typeOk;
    });
  }, [events, selectedDate, selectedType]);

  return (
    <AppContext.Provider
      value={{
        events,
        favorites,
        selectedDate,
        selectedType,
        loadingEvents,
        eventsError,
        refreshEvents,
        toggleFavorite,
        isFavorite,
        setSelectedDate,
        setSelectedType,
        filteredEvents,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}
