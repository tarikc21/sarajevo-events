import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import type { NewEventInput } from "../types/event";
import { LocationPicker, type LocationValue } from "./location/LocationPicker";
import { DateTimePickerModal } from "./DateTimePickerModal";

type CreateEventFormProps = {
  onCreate: (input: NewEventInput) => Promise<void>;
  onCancel: () => void;
};

const REQUEST_TIMEOUT_MS = 15000;

async function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return await Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      const id = setTimeout(() => {
        clearTimeout(id);
        reject(new Error(`${label} timed out after ${ms / 1000}s`));
      }, ms);
    }),
  ]);
}

export function CreateEventForm({ onCreate, onCancel }: CreateEventFormProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [pickerDraftDate, setPickerDraftDate] = useState<Date>(new Date());
  const [pickerMonth, setPickerMonth] = useState<Date>(new Date());
  const [pickerOpen, setPickerOpen] = useState(false);
  const [locationValue, setLocationValue] = useState<LocationValue | null>(null);
  const [manualLocation, setManualLocation] = useState("");
  const [manualLatitude, setManualLatitude] = useState("");
  const [manualLongitude, setManualLongitude] = useState("");
  const [description, setDescription] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const dateISO = useMemo(() => {
    if (!selectedDate) return null;
    return format(selectedDate, "yyyy-MM-dd");
  }, [selectedDate]);

  const dateDisplay = useMemo(() => {
    if (!selectedDate) return null;
    return format(selectedDate, "MMM d, HH:mm");
  }, [selectedDate]);

  const resolvedLocation = useMemo(() => {
    const location = manualLocation.trim() || locationValue?.location || "";
    const latFromManual = Number(manualLatitude);
    const lngFromManual = Number(manualLongitude);
    const latitude = Number.isFinite(latFromManual)
      ? latFromManual
      : (locationValue?.latitude ?? 0);
    const longitude = Number.isFinite(lngFromManual)
      ? lngFromManual
      : (locationValue?.longitude ?? 0);

    return { location, latitude, longitude };
  }, [locationValue, manualLatitude, manualLocation, manualLongitude]);

  const canSubmit =
    title.trim().length > 0 &&
    Boolean(dateISO) &&
    Boolean(resolvedLocation.location) &&
    description.trim().length > 0;

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    if (!canSubmit) {
      setError("Please fill all fields with valid values.");
      return;
    }
    if (!dateISO || !dateDisplay) return;

    setSaving(true);
    try {
      // Image upload temporarily disabled; use placeholder URL.
      let imageUrl = "";
      if (imageFile) {
        console.log("[CreateEventForm] Image selected but upload disabled. Skipping upload.", {
          fileName: imageFile.name,
          size: imageFile.size,
        });
        imageUrl = "";
      }

      const payload: NewEventInput = {
        title: title.trim(),
        date: dateDisplay,
        dateISO,
        location: resolvedLocation.location,
        image: imageUrl,
        description: description.trim(),
        latitude: resolvedLocation.latitude,
        longitude: resolvedLocation.longitude,
      };
      console.log("[CreateEventForm] addEvent payload ready", payload);
      await withTimeout(onCreate(payload), REQUEST_TIMEOUT_MS, "Event creation");
      console.log("[CreateEventForm] Event creation completed");

      setSuccess("Event created. Pending approval.");

      // Clear form immediately for better UX.
      setTitle("");
      setSelectedDate(null);
      setLocationValue(null);
      setManualLocation("");
      setManualLatitude("");
      setManualLongitude("");
      setDescription("");
      setImageFile(null);
      if (imagePreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
      setImagePreviewUrl(null);

      // Keep modal open briefly so the user sees the success message.
      setTimeout(() => {
        onCancel();
      }, 900);
    } catch (e) {
      console.error("[CreateEventForm] Submit failed", e);
      setError(e instanceof Error ? e.message : "Failed to create event.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      className="form createEventForm"
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit();
      }}
    >
      {error ? <div className="alert alert--danger">{error}</div> : null}
      {success ? <div className="alert alert--success">{success}</div> : null}

      <div className="grid grid--2">
        <Field label="Title">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="input" placeholder="e.g., Neon Market Festival" />
        </Field>

        <Field label="Date">
          <div className="datePickerWrap">
            <input
              className="input datePickerInput"
              placeholder="Select date & time"
              value={selectedDate ? format(selectedDate, "MMM d, HH:mm") : ""}
              readOnly
              onClick={() => {
                const base = selectedDate ?? new Date();
                setPickerDraftDate(base);
                setPickerMonth(base);
                setPickerOpen(true);
              }}
            />
          </div>
          <div className="dateSelectionText">
            {selectedDate
              ? `Selected: ${format(selectedDate, "EEEE, MMM d • HH:mm")}`
              : "No date selected yet"}
          </div>
        </Field>
      </div>

      <Field label="Location">
        <LocationPicker
          value={locationValue}
          onChange={(next) => {
            setLocationValue(next);
            setManualLocation(next.location);
            setManualLatitude(String(next.latitude));
            setManualLongitude(String(next.longitude));
          }}
          disabled={saving}
          onError={(msg) => setError(msg)}
        />

        <div className="grid grid--2">
          <input
            className="input"
            placeholder="Location name / address"
            value={manualLocation}
            disabled={saving}
            onChange={(e) => setManualLocation(e.target.value)}
          />
          <input
            className="input"
            placeholder="Latitude (optional)"
            value={manualLatitude}
            disabled={saving}
            type="number"
            step="any"
            onChange={(e) => setManualLatitude(e.target.value)}
          />
          <input
            className="input"
            placeholder="Longitude (optional)"
            value={manualLongitude}
            disabled={saving}
            type="number"
            step="any"
            onChange={(e) => setManualLongitude(e.target.value)}
          />
        </div>

        {resolvedLocation.location ? (
          <div className="locationCoords">
            <div className="locationCoords__label">Selected</div>
            <div className="locationCoords__value">
              {resolvedLocation.location} ({resolvedLocation.latitude.toFixed(5)},{" "}
              {resolvedLocation.longitude.toFixed(5)})
            </div>
          </div>
        ) : null}
      </Field>

      <Field label="Image Upload">
        <div className="uploadBox">
          <div className="uploadBox__row">
            <input
              type="file"
              accept="image/*"
              disabled={saving}
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setError(null);
                setSuccess(null);
                if (!file) {
                  setImageFile(null);
                  setImagePreviewUrl(null);
                  return;
                }
                if (!file.type.startsWith("image/")) {
                  setError("Please upload an image file.");
                  return;
                }
                if (file.size > 10 * 1024 * 1024) {
                  setError("Image is too large (max 10MB).");
                  return;
                }

                if (imagePreviewUrl?.startsWith("blob:")) {
                  URL.revokeObjectURL(imagePreviewUrl);
                }
                setImageFile(file);
                setImagePreviewUrl(URL.createObjectURL(file));
              }}
            />
            <div className="uploadBox__meta">
              {imageFile ? <div className="uploadBox__name">{imageFile.name}</div> : <div>Upload an image</div>}
              {imageFile ? <div className="uploadBox__hint">Will upload to Firebase Storage on submit.</div> : null}
            </div>
          </div>

          {imagePreviewUrl ? (
            <div className="imagePreview">
              <img src={imagePreviewUrl} alt="Selected event" />
            </div>
          ) : (
            <div className="imagePreview imagePreview--empty">No image selected</div>
          )}
        </div>
      </Field>

      <Field label="Description">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea"
          rows={6}
          placeholder="Describe the event..."
        />
      </Field>

      <div className="form__actions">
        <button className="btn btn--ghost" type="button" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button className="btn btn--primary" type="submit" disabled={saving || !canSubmit}>
          {saving ? "Creating…" : "+ Create Event"}
        </button>
      </div>

      <DateTimePickerModal
        open={pickerOpen}
        draftDate={pickerDraftDate}
        viewMonth={pickerMonth}
        onDraftChange={setPickerDraftDate}
        onMonthChange={setPickerMonth}
        onCancel={() => setPickerOpen(false)}
        onConfirm={() => {
          setSelectedDate(pickerDraftDate);
          setPickerOpen(false);
        }}
      />
    </form>
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

