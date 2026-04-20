import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider } from "@/context/AppContext";
import { RootNavigator } from "@/navigation/RootNavigator";
import { colors } from "@/theme/colors";

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="light" backgroundColor={colors.background} />
        <RootNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}
