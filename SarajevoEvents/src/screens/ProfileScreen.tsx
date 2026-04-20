import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

export function ProfileScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Ionicons name="sparkles" size={28} color={colors.neonPurple} />
        <Text style={styles.title}>Sarajevo Events</Text>
        <Text style={styles.text}>Premium profile and social features coming soon.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.md,
  },
  card: {
    width: "100%",
    borderRadius: 20,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "700",
  },
  text: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
});
