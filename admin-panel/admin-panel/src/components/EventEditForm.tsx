import { useEffect, useMemo, useState } from "react";
import type { AdminEvent, EventUpdate } from "../types/event";

type EventEditFormProps = {
  event: AdminEvent;
  onSave: (update: EventUpdate) => Promise<void>;
  onCancel: () => void;
};

export function EventEditForm({ event, onSave, onCancel }: EventEditFormProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(event.title);
  const [date, setDate] = useState(event.date);
  const [location, setLocation] = useState(event.location);
  const [image, setImage] = useState(event.image);
  const [description, setDescription] = useState(event.description);
  const [latitude, setLatitude] = useState(String(event.latitude));
  const [longitude, setLongitude] = useState(String(event.longitude));

  useEffect(() => {
    setTitle(event.title);
    setDate(event.date);
    setLocation(event.location);
    setImage(event.image);
    setDescription(event.description);
    setLatitude(String(event.latitude));
    setLongitude(String(event.longitude));
  }, [event]);

  const update = useMemo<EventUpdate>(() => {
    const lat = Number(latitude);
    const lng = Number(longitude);

    return {
      title,
      date,
      location,
      image,
      description,
      latitude: Number.isFinite(lat) ? lat : 0,
      longitude: Number.isFinite(lng) ? lng : 0,
    };
  }, [date, description, image, latitude, location, longitude, title]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await onSave(update);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form">
      {error ? <div className="alert alert--danger">{error}</div> : null}
      <div className="grid grid--2">
        <Field label="Title">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
        </Field>
        <Field label="Date">
          <input value={date} onChange={(e) => setDate(e.target.value)} className="input" />
        </Field>
        <Field label="Location">
          <input value={location} onChange={(e) => setLocation(e.target.value)} className="input" />
        </Field>
        <Field label="Image URL">
          <input value={image} onChange={(e) => setImage(e.target.value)} className="input" />
        </Field>
        <Field label="Latitude">
          <input value={latitude} onChange={(e) => setLatitude(e.target.value)} className="input" />
        </Field>
        <Field label="Longitude">
          <input value={longitude} onChange={(e) => setLongitude(e.target.value)} className="input" />
        </Field>
      </div>

      <Field label="Description">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea"
          rows={6}
        />
      </Field>

      <div className="form__actions">
        <button className="btn btn--ghost" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: import("react").ReactNode }) {
  return (
    <label className="field">
      <div className="field__label">{label}</div>
      {children}
    </label>
  );
}

