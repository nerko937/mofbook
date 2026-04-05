import { Stack } from "expo-router";
import { theme } from "../theme";
import "../i18n";

export default function RootLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.colors.background
                },
                headerTintColor: theme.colors.text,
                headerTitleStyle: {
                    color: theme.colors.text
                },
                contentStyle: {
                    backgroundColor: theme.colors.background
                }
            }}
        />
    );
}
