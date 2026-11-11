import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { Link } from "expo-router";
import { Todo } from "@/db/schema";

const TodoRow = React.memo(function TodoRow({ todo }: { todo: Todo }) {
  return (
    <Link
      testID="todo-row"
      href={{
        pathname: "/todos/[id]",
        params: { id: todo.id },
      }}
      asChild
    >
      <TouchableOpacity style={styles.row}>
        <Text style={styles.text}>{todo.name}</Text>
      </TouchableOpacity>
    </Link>
  );
});

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
  row: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
});

export default TodoRow;
