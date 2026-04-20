import React, { useMemo, useState } from "react";
import {
  GoogleMap,
  Marker,
  StandaloneSearchBox,
  useLoadScript,
} from "@react-google-maps/api";

export type LocationValue = {
  location: string;
  latitude: number;
  longitude: number;
};

type LocationPickerProps = {
  value: LocationValue | null;
  onChange: (value: LocationValue) => void;
  disabled?: boolean;
  onError?: (message: string) => void;
};

declare global {
  // google maps types are provided by @types/google.maps via @react-google-maps/api,
  // but we still guard runtime access.
  interface Window {
    google?: typeof google;
  }
}

const Sarajevo = { lat: 43.8563, lng: 18.4131 };
const LIBRARIES: ("places")[] = ["places"];

function LocationPickerComponent({ value, onChange, disabled, onError }: LocationPickerProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const hasKey = Boolean(apiKey);

  const [resolving, setResolving] = useState(false);
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey ?? "",
    libraries: LIBRARIES,
  });

  const mapCenter = useMemo(() => {
    if (value) return { lat: value.latitude, lng: value.longitude };
    return Sarajevo;
  }, [value]);

  const darkMapStyles = useMemo(
    () => [
      { elementType: "geometry", stylers: [{ color: "#0b0d12" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#f5f7ff" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#0b0d12" }] },
      {
        featureType: "administrative",
        elementType: "geometry",
        stylers: [{ color: "#131a2b" }],
      },
      { featureType: "road", elementType: "geometry", stylers: [{ color: "#1c2130" }] },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#b7c0d9" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#b7c0d9" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#0f1a20" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#1c2130" }],
      },
      { featureType: "water", elementType: "geometry", stylers: [{ color: "#0b1b26" }] },
    ],
    []
  );

  const reverseGeocode = async (lat: number, lng: number) => {
    if (!hasKey) {
      onChange({
        location: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        latitude: lat,
        longitude: lng,
      });
      return;
    }

    if (!window.google?.maps) {
      // In case script isn't ready yet.
      onChange({
        location: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        latitude: lat,
        longitude: lng,
      });
      return;
    }

    setResolving(true);
    try {
      const geocoder = new window.google.maps.Geocoder();
      const results = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        geocoder.geocode({ location: { lat, lng } }, (res, status) => {
          if (status === "OK" && res && res.length > 0) resolve(res);
          else reject(status);
        });
      });

      const first = results[0];
      const formatted = first.formatted_address ?? `${lat}, ${lng}`;
      onChange({ location: String(formatted), latitude: lat, longitude: lng });
    } catch {
      onError?.("Could not resolve address from selected map point.");
      onChange({
        location: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        latitude: lat,
        longitude: lng,
      });
    } finally {
      setResolving(false);
    }
  };

  const onMapClick = async (e: google.maps.MapMouseEvent) => {
    if (disabled) return;
    const lat = e.latLng?.lat();
    const lng = e.latLng?.lng();
    if (typeof lat !== "number" || typeof lng !== "number") return;
    await reverseGeocode(lat, lng);
  };

  const onPlacesChanged = () => {
    if (disabled) return;
    const places = searchBox?.getPlaces() ?? null;
    const place = places && places.length > 0 ? places[0] : null;
    if (!place) return;

    const lat = place.geometry?.location?.lat();
    const lng = place.geometry?.location?.lng();
    if (typeof lat !== "number" || typeof lng !== "number") return;

    const locationName = place.formatted_address ?? place.name ?? `${lat}, ${lng}`;
    onChange({ location: String(locationName), latitude: lat, longitude: lng });
  };

  // If no key is provided, still allow the form to be used.
  const showFallback = !hasKey || Boolean(loadError);
  if (showFallback) {
    return (
      <div className="locationFallback">
        <div className="alert alert--danger">
          {!hasKey
            ? "Google Maps API key is missing. Use manual location fields."
            : "Google Maps failed to load. Use manual location fields."}
        </div>
        <div className="grid grid--2">
          <input
            className="input"
            placeholder="Latitude"
            value={value?.latitude ?? ""}
            type="number"
            step="any"
            disabled={disabled}
            onChange={(e) => {
              const lat = Number(e.target.value);
              if (!Number.isFinite(lat)) return;
              onChange({
                location: value?.location ?? "",
                latitude: lat,
                longitude: value?.longitude ?? Sarajevo.lng,
              });
            }}
          />
          <input
            className="input"
            placeholder="Longitude"
            value={value?.longitude ?? ""}
            type="number"
            step="any"
            disabled={disabled}
            onChange={(e) => {
              const lng = Number(e.target.value);
              if (!Number.isFinite(lng)) return;
              onChange({
                location: value?.location ?? "",
                latitude: value?.latitude ?? Sarajevo.lat,
                longitude: lng,
              });
            }}
          />
        </div>
        <input
          className="input"
          placeholder="Location name / address"
          value={value?.location ?? ""}
          disabled={disabled}
            onChange={(e) =>
              onChange({
                location: e.target.value,
                latitude: value?.latitude ?? Sarajevo.lat,
                longitude: value?.longitude ?? Sarajevo.lng,
              })
            }
        />
      </div>
    );
  }

  return (
    <div className="locationPicker">
      <div className="locationPicker__search">
        {isLoaded ? (
          <StandaloneSearchBox onLoad={(ref) => setSearchBox(ref)} onPlacesChanged={onPlacesChanged}>
            <input className="input locationSearch" placeholder="Search location…" />
          </StandaloneSearchBox>
        ) : (
          <input className="input locationSearch" placeholder="Loading location search…" disabled />
        )}
      </div>

      <div className="mapBox">
        {!isLoaded ? (
          <div className="mapLoading">Loading map…</div>
        ) : (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: 280, borderRadius: 16 }}
            center={mapCenter}
            zoom={13}
            onClick={onMapClick}
            options={{
              disableDefaultUI: true,
              clickableIcons: false,
              styles: darkMapStyles as unknown as google.maps.MapTypeStyle[],
            }}
          >
            {value ? (
              <Marker position={{ lat: value.latitude, lng: value.longitude }} />
            ) : (
              <Marker position={Sarajevo} />
            )}
          </GoogleMap>
        )}

        {isLoaded && resolving ? <div className="mapOverlayPill">Finding address…</div> : null}
      </div>
      <div className="mapHint">
        {isLoaded
          ? "Click on the map or search to fill location and coordinates."
          : "Map is loading. You can continue with manual location fields."}
      </div>
    </div>
  );
}

export const LocationPicker = React.memo(LocationPickerComponent);

