import {
  FlatList,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTodos } from "@/hooks/todos";
import CommonTextSubmitter from "@/components/CommonTextSubmitter";
import TodoRow from "@/components/TodoRow";

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
        renderItem={({ item: todo }) => <TodoRow todo={todo} />}
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
});
