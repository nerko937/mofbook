import { FlatList, StyleSheet, Text } from "react-native";
import { useTodos } from "@/hooks/todos";
import TextSubmitter from "@/components/ui/TextSubmitter";
import TodoRow from "@/components/index/TodoRow";

export default function Index() {
  const { fetchedTodos, addTodo } = useTodos();

  return (
    <>
      <Text style={styles.header}>Todos</Text>
      <FlatList
        style={styles.list}
        data={fetchedTodos ?? []}
        keyExtractor={(todo) => todo.id.toString()}
        renderItem={({ item: todo }) => <TodoRow todo={todo} />}
      />
      <TextSubmitter externalHandler={addTodo} />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  list: {
    flex: 1,
  },
});
