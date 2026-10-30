import { Dispatch, SetStateAction } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Checkbox } from "expo-checkbox";
import { TodoGroup, TodoItem } from "@/db/schema";
import { groupColors } from "@/groupColors";

type TodoItemRowProps = {
  row: { item: TodoItem; group: TodoGroup };
  checkedIds: number[];
  setCheckedIds: Dispatch<SetStateAction<number[]>>;
};

const TodoItemRow = ({ row, checkedIds, setCheckedIds }: TodoItemRowProps) => {
  const toggleChecked = () => {
    if (checkedIds.includes(row.item.id)) {
      setCheckedIds(checkedIds.filter((id) => id !== row.item.id));
    } else {
      setCheckedIds([...checkedIds, row.item.id]);
    }
  };

  return (
    <View style={styles.row}>
      <Checkbox
        testID="todo-item-chbox"
        style={styles.checkbox}
        value={checkedIds.includes(row.item.id)}
        onValueChange={toggleChecked}
      />
      <Text
        testID="todo-item-color"
        style={{
          color: groupColors[row.group.position - 1],
          fontSize: 20,
        }}
      >
        ■{" "}
      </Text>
      <Text testID="todo-item-content" style={styles.text}>
        {row.item.content}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    marginRight: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  text: {
    fontSize: 16,
  },
});

export default TodoItemRow;
