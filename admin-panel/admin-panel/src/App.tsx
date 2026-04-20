import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { Modal } from "./components/Modal";
import { EventEditForm } from "./components/EventEditForm";
import { CreateEventForm } from "./components/CreateEventForm";
import type { AdminEvent } from "./types/event";
import { addEvent, approveEvent, deleteEvent, fetchAllEvents, updateEvent } from "./services/events";

function App() {
  const [active, setActive] = useState<"events">("events");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [pendingOnly, setPendingOnly] = useState(false);
  const [editing, setEditing] = useState<AdminEvent | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const visibleEvents = useMemo(
    () => (pendingOnly ? events.filter((e) => !e.approved) : events),
    [events, pendingOnly]
  );

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllEvents();
      setEvents(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const onApprove = async (id: string) => {
    await approveEvent(id);
    await refresh();
  };

  const onDelete = async (id: string) => {
    const ok = confirm("Delete this event? This cannot be undone.");
    if (!ok) return;
    await deleteEvent(id);
    await refresh();
  };

  const onSaveEdit = async (update: Partial<Omit<AdminEvent, "id">>) => {
    if (!editing) return;
    await updateEvent(editing.id, update);
    setEditing(null);
    await refresh();
  };

  const onCreate = async (input: Parameters<typeof addEvent>[0]) => {
    console.log("[AddEvent] Start create request", {
      title: input.title,
      dateISO: input.dateISO,
      location: input.location,
    });
    try {
      const createdId = await addEvent(input);
      console.log("[AddEvent] Firestore addEvent resolved", { createdId });
      await refresh();
      console.log("[AddEvent] Refresh completed");
    } catch (error) {
      console.error("[AddEvent] Firestore create failed", error);
      throw error;
    }
  };

  return (
    <div className="appShell">
      <Sidebar active={active} setActive={setActive} />
      <main className="main">
        <Topbar
          title="Events"
          right={
            <div className="topbarActions">
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={pendingOnly}
                  onChange={(e) => setPendingOnly(e.target.checked)}
                />
                <span>Pending only</span>
              </label>
              <button className="btn btn--primary" onClick={() => setCreateOpen(true)}>
                + Add Event
              </button>
              <button className="btn btn--ghost" onClick={() => void refresh()}>
                Refresh
              </button>
            </div>
          }
        />

        <section className="content">
          <div className="statsRow">
            <Stat label="Total events" value={events.length} />
            <Stat label="Approved" value={events.filter((e) => e.approved).length} />
            <Stat label="Pending" value={events.filter((e) => !e.approved).length} accent />
          </div>

          {loading ? <div className="empty">Loading events…</div> : null}
          {error ? <div className="alert alert--danger">{error}</div> : null}

          <div className="gridCards">
            {visibleEvents.map((event) => (
              <article key={event.id} className="card">
                <div className="card__top">
                  <div>
                    <div className="card__title">{event.title}</div>
                    <div className="card__meta">
                      <span>{event.date}</span>
                      <span className="dot">•</span>
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className={`badge ${event.approved ? "badge--ok" : "badge--pending"}`}>
                    {event.approved ? "Approved" : "Pending"}
                  </div>
                </div>

                <div className="card__actions">
                  <button className="btn btn--ghost" onClick={() => setEditing(event)}>
                    Edit
                  </button>
                  <button className="btn btn--danger" onClick={() => void onDelete(event.id)}>
                    Delete
                  </button>
                  <button
                    className="btn btn--primary"
                    disabled={event.approved}
                    onClick={() => void onApprove(event.id)}
                  >
                    Approve
                  </button>
                </div>
              </article>
            ))}
          </div>

          {!loading && !error && visibleEvents.length === 0 ? (
            <div className="empty">No events match the current filter.</div>
          ) : null}
        </section>
      </main>

      <Modal open={Boolean(editing)} title="Edit event" onClose={() => setEditing(null)}>
        {editing ? (
          <EventEditForm event={editing} onSave={onSaveEdit} onCancel={() => setEditing(null)} />
        ) : null}
      </Modal>

      <Modal open={createOpen} title="Create event" onClose={() => setCreateOpen(false)}>
        <CreateEventForm onCreate={onCreate} onCancel={() => setCreateOpen(false)} />
      </Modal>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className={`stat ${accent ? "stat--accent" : ""}`}>
      <div className="stat__label">{label}</div>
      <div className="stat__value">{value}</div>
    </div>
  );
}

export default App;
