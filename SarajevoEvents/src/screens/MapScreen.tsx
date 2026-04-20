import { useMemo, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useAppContext } from "@/context/AppContext";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { SarajevoEvent } from "@/types/event";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

export function MapScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { filteredEvents } = useAppContext();
  const [selectedEvent, setSelectedEvent] = useState<SarajevoEvent | null>(null);

  const initialRegion = useMemo(
    () => ({
      latitude: 43.8563,
      longitude: 18.4131,
      latitudeDelta: 0.08,
      longitudeDelta: 0.08,
    }),
    []
  );

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion} showsUserLocation>
        {filteredEvents.map((event) => (
          <Marker
            key={event.id}
            coordinate={event.coordinates}
            title={event.title}
            description={event.location}
            pinColor={colors.neonPurple}
            onPress={() => setSelectedEvent(event)}
          />
        ))}
      </MapView>

      {selectedEvent ? (
        <Pressable
          style={styles.preview}
          onPress={() => navigation.navigate("EventDetails", { event: selectedEvent })}
        >
          <Text style={styles.previewTitle}>{selectedEvent.title}</Text>
          <Text style={styles.previewMeta}>{selectedEvent.date}</Text>
          <Text style={styles.previewMeta}>{selectedEvent.location}</Text>
          <Text style={styles.previewAction}>Tap for details</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  map: {
    flex: 1,
  },
  preview: {
    position: "absolute",
    bottom: spacing.lg,
    left: spacing.md,
    right: spacing.md,
    borderRadius: 18,
    padding: spacing.md,
    backgroundColor: "rgba(20, 24, 36, 0.96)",
    borderColor: colors.border,
    borderWidth: 1,
  },
  previewTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  previewMeta: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  previewAction: {
    color: colors.neonBlue,
    marginTop: spacing.sm,
    fontSize: 13,
    fontWeight: "600",
  },
});
