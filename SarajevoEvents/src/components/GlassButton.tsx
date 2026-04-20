import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "@/theme/colors";

type GlassButtonProps = {
  title: string;
  onPress: () => void;
};

export function GlassButton({ title, onPress }: GlassButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: colors.neonBlue,
    shadowColor: colors.neonPurple,
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
