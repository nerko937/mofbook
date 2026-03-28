import { View, StyleSheet } from "react-native";
import Home from "../navigation/home";
import { theme } from "../theme";

export default function Index() {
  return (
    <View style={styles.container}>
      <Home />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
