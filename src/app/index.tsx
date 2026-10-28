import {
  FlatList,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";
import { useTodos } from "@/hooks/todos";
import CommonTextSubmitter from "@/components/CommonTextSubmitter";

export default function Index() {
  const { fetchedTodos, addTodo } = useTodos();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.header}>Todos</Text>

      <FlatList
        data={fetchedTodos}
        keyExtractor={(todo) => todo.id.toString()}
        renderItem={({ item }) => (
          <Link
            testID="todo-row"
            href={{
              pathname: "/todos/[id]",
              params: { id: item.id },
            }}
            asChild
          >
            {/* Wrap in TouchableOpacity for mobile interaction feedback */}
            <TouchableOpacity style={styles.row}>
              <Text style={styles.text}>{item.name}</Text>
            </TouchableOpacity>
          </Link>
        )}
      />

      <CommonTextSubmitter externalHandler={addTodo} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
  },
  row: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  text: {
    fontSize: 16,
  },
});
