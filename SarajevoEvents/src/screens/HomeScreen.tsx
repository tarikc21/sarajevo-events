import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { EventCard } from "@/components/EventCard";
import { FilterChips } from "@/components/FilterChips";
import { SectionHeader } from "@/components/SectionHeader";
import { useAppContext } from "@/context/AppContext";
import { RootStackParamList } from "@/navigation/RootNavigator";
import { colors } from "@/theme/colors";
import { spacing } from "@/theme/spacing";

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    selectedDate,
    selectedType,
    setSelectedDate,
    setSelectedType,
    filteredEvents,
    loadingEvents,
    eventsError,
    refreshEvents,
    toggleFavorite,
    isFavorite,
  } = useAppContext();

  const tonightEvents = filteredEvents.filter((event) => event.isTonight);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeader title="Tonight in Sarajevo" subtitle="Handpicked experiences for your night" />
        <FilterChips
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
        />
        {loadingEvents ? (
          <Text style={styles.emptyText}>Loading events…</Text>
        ) : eventsError ? (
          <Text style={styles.emptyText} onPress={() => void refreshEvents()}>
            {`Couldn't load events. Tap to retry.\n${eventsError}`}
          </Text>
        ) : null}
        {tonightEvents.length > 0 ? (
          tonightEvents.map((event, idx) => (
            <EventCard
              key={`tonight-${event.id}`}
              event={event}
              onPress={() => navigation.navigate("EventDetails", { event })}
              onToggleFavorite={() => toggleFavorite(event.id)}
              favorite={isFavorite(event.id)}
              delay={idx * 70}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>
            {loadingEvents ? "" : "No events tonight for current filters."}
          </Text>
        )}

        <SectionHeader title="Explore all events" subtitle={`${filteredEvents.length} live listings`} />
        {filteredEvents.map((event, idx) => (
          <EventCard
            key={event.id}
            event={event}
            onPress={() => navigation.navigate("EventDetails", { event })}
            onToggleFavorite={() => toggleFavorite(event.id)}
            favorite={isFavorite(event.id)}
            delay={idx * 80}
          />
        ))}
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
    marginBottom: spacing.md,
  },
});
