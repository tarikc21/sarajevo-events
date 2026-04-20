import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { SarajevoEvent } from "@/types/event";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

type EventCardProps = {
  event: SarajevoEvent;
  onPress: () => void;
  onToggleFavorite: () => void;
  favorite: boolean;
  delay?: number;
};

export function EventCard({
  event,
  onPress,
  onToggleFavorite,
  favorite,
  delay = 0,
}: EventCardProps) {
  return (
    <Animated.View entering={FadeInDown.duration(500).delay(delay)}>
      <Pressable onPress={onPress} style={styles.card}>
        <Image source={{ uri: event.image }} style={styles.image} />
        <Pressable onPress={onToggleFavorite} style={styles.favoriteButton}>
          <Ionicons
            name={favorite ? "heart" : "heart-outline"}
            size={20}
            color={favorite ? colors.danger : colors.textPrimary}
          />
        </Pressable>
        <View style={styles.content}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.meta}>{event.date}</Text>
          <Text style={styles.meta}>{event.location}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    marginBottom: spacing.md,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    borderWidth: 1,
    borderColor: "#222A3D",
  },
  image: {
    width: "100%",
    height: 180,
  },
  favoriteButton: {
    position: "absolute",
    right: spacing.md,
    top: spacing.md,
    backgroundColor: "rgba(11, 13, 18, 0.75)",
    borderRadius: 999,
    padding: 8,
  },
  content: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "700",
  },
  meta: {
    color: colors.textSecondary,
    fontSize: 13,
  },
});
