import { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Text, View } from "react-native";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../db/drizzle/migrations";
import { db } from "@/db/client";

// Prevent the splash screen from auto-hiding while we migrate the database
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (success || error) {
      // Hide the splash screen once migrations are complete
      SplashScreen.hideAsync();
    }
  }, [success, error]);

  if (error) {
    return (
      <View>
        <Text>Database Error: {error.message}</Text>
      </View>
    );
  }

  // Render nothing while migrations are running; the Splash Screen covers this
  if (!success) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="todos/[id]" />
    </Stack>
  );
}
