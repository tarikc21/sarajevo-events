import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { EventType } from "@/types/event";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

const TYPES: { id: EventType | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "club", label: "Club" },
  { id: "concert", label: "Concert" },
  { id: "festival", label: "Festival" },
];

const DATES = [
  { id: "all", label: "Any date" },
  { id: "2026-03-30", label: "Tonight" },
  { id: "2026-04-02", label: "Apr 2" },
  { id: "2026-04-10", label: "Apr 10" },
  { id: "2026-04-19", label: "Apr 19" },
];

type FilterChipsProps = {
  selectedType: EventType | "all";
  onTypeChange: (type: EventType | "all") => void;
  selectedDate: string | null;
  onDateChange: (date: string | null) => void;
};

export function FilterChips({
  selectedType,
  onTypeChange,
  selectedDate,
  onDateChange,
}: FilterChipsProps) {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {TYPES.map((type) => (
          <Chip
            key={type.id}
            label={type.label}
            active={selectedType === type.id}
            onPress={() => onTypeChange(type.id)}
          />
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {DATES.map((date) => (
          <Chip
            key={date.id}
            label={date.label}
            active={(selectedDate ?? "all") === date.id}
            onPress={() => onDateChange(date.id === "all" ? null : date.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

type ChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function Chip({ label, active, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.activeChip]}
      android_ripple={{ color: "rgba(79, 124, 255, 0.25)" }}
    >
      <Text style={[styles.chipText, active && styles.activeChipText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chip: {
    marginRight: spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  activeChip: {
    borderColor: colors.neonBlue,
    backgroundColor: "#1D2750",
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  activeChipText: {
    color: colors.textPrimary,
  },
});
