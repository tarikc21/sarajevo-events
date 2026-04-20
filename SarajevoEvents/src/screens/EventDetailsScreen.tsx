import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { GlassButton } from "@/components/GlassButton";
import { useAppContext } from "@/context/AppContext";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

type Props = NativeStackScreenProps<RootStackParamList, "EventDetails">;

export function EventDetailsScreen({ route }: Props) {
  const { event } = route.params;
  const { isFavorite, toggleFavorite } = useAppContext();

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: event.image }} style={styles.headerImage} />
        <Animated.View entering={FadeInUp.duration(450)} style={styles.content}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.meta}>{event.date}</Text>
          <Text style={styles.meta}>{event.location}</Text>
          <Text style={styles.description}>{event.description}</Text>
          <View style={styles.row}>
            <GlassButton title="Reserve" onPress={() => {}} />
          </View>
          <View style={styles.favoriteWrap}>
            <Text style={styles.favoriteText}>
              {isFavorite(event.id) ? "In your favorites" : "Not in favorites yet"}
            </Text>
            <Text style={styles.favoriteAction} onPress={() => toggleFavorite(event.id)}>
              {isFavorite(event.id) ? "Remove" : "Save"}
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerImage: {
    width: "100%",
    height: 320,
  },
  content: {
    padding: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: "800",
    marginBottom: spacing.sm,
  },
  meta: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  description: {
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 24,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  row: {
    marginBottom: spacing.md,
  },
  favoriteWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  favoriteText: {
    color: colors.textSecondary,
  },
  favoriteAction: {
    color: colors.neonBlue,
    fontWeight: "700",
  },
});
