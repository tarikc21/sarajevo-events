import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { EventCard } from "@/components/EventCard";
import { SectionHeader } from "@/components/SectionHeader";
import { useAppContext } from "@/context/AppContext";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

export function FavoritesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { filteredEvents, favorites, toggleFavorite, isFavorite } = useAppContext();
  const favoriteEvents = filteredEvents.filter((event) => favorites.includes(event.id));

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeader title="Favorites" subtitle="Your saved Sarajevo nights" />
        {favoriteEvents.length === 0 ? (
          <Text style={styles.emptyText}>
            No favorites yet. Save events from Home or Map to see them here.
          </Text>
        ) : (
          favoriteEvents.map((event, idx) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() => navigation.navigate("EventDetails", { event })}
              onToggleFavorite={() => toggleFavorite(event.id)}
              favorite={isFavorite(event.id)}
              delay={idx * 70}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
});
