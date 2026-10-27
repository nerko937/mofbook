import {
  Modal,
  FlatList,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import type { TodoGroup } from "../../db/schema";
import { useTodoGroups, useTodoItems, useTodos } from "@/hooks/todos";
import { groupColors } from "@/groupColors";
import { Checkbox } from "expo-checkbox";

export default function TodoDetails() {
  const { id } = useLocalSearchParams();
  const safeId = Array.isArray(id) ? Number(id[0]) : Number(id);

  const [newItemText, setNewItemText] = useState("");
  const { itemsWithGroups, addTodoItem, deleteTodoItems } =
    useTodoItems(safeId);
  const { fetchedGroups, addTodoGroup } = useTodoGroups(safeId);

  const groups = fetchedGroups ?? [];

  const [selectedGroup, setSelectedGroup] = useState<TodoGroup | undefined>();
  const resolvedSelectedGroup = selectedGroup ?? groups[0];
  const [groupSelectModalOpen, setGroupSelectModalOpen] = useState(false);

  const handleAddItem = async () => {
    if (!newItemText.trim() || !resolvedSelectedGroup) return;

    await addTodoItem({
      groupId: resolvedSelectedGroup.id,
      content: newItemText,
    });
    setNewItemText("");
  };

  const handleAddGroup = async () => {
    if (groups.length >= 10) return;
    const newGroup = await addTodoGroup({
      todoId: safeId,
      position: groups.length + 1,
    });
    setSelectedGroup(newGroup);
  };

  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const toggleChecked = (itemId: number) => {
    if (checkedIds.includes(itemId)) {
      setCheckedIds(checkedIds.filter((id) => id !== itemId));
    } else {
      setCheckedIds([...checkedIds, itemId]);
    }
  };

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { deleteTodo } = useTodos();

  return (
    <View style={styles.container}>
      <Button
        testID="delete-todo-btn"
        title="Delete whole todo"
        onPress={() => setDeleteModalOpen(true)}
      />
      <Modal
        transparent={true}
        visible={deleteModalOpen}
        onRequestClose={() => {
          setDeleteModalOpen(false);
        }}
      >
        <Text>Are you sure?</Text>
        <Button
          testID="delete-todo-confirm-btn"
          title="Yes"
          onPress={() => {
            deleteTodo(safeId);
            router.replace("/");
          }}
        />
        <Button
          testID="delete-todo-dismiss-btn"
          title="No"
          onPress={() => setDeleteModalOpen(false)}
        />
      </Modal>
      {checkedIds.length > 0 ? (
        <View>
          <Text>Selected items: {checkedIds.length}</Text>
          <Button
            testID="delete-checked-items-btn"
            title="Delete"
            onPress={() => {
              deleteTodoItems(checkedIds);
              setCheckedIds([]);
            }}
          />
        </View>
      ) : undefined}
      <View style={styles.inputContainer}>
        <Button
          testID="change-group-btn"
          title="Group"
          color={groupColors[(resolvedSelectedGroup?.position ?? 1) - 1]}
          onPress={() => setGroupSelectModalOpen(true)}
        />
        <Modal
          transparent={true}
          visible={groupSelectModalOpen}
          onRequestClose={() => {
            setGroupSelectModalOpen(false);
          }}
        >
          <Button
            testID="add-group-btn"
            title="Add group"
            onPress={handleAddGroup}
          />
          {groups.map((group) => (
            <Button
              testID="select-group-btn"
              title="Swtich to"
              key={group.id}
              color={groupColors[group.position - 1]}
              onPress={() => {
                setSelectedGroup(group);
                setGroupSelectModalOpen(false);
              }}
            />
          ))}
        </Modal>
        <TextInput
          style={styles.input}
          testID="todo-item-input"
          placeholder="Add a new item..."
          value={newItemText}
          onChangeText={setNewItemText}
          onSubmitEditing={handleAddItem}
        />
        <Button
          title="Add"
          testID="todo-item-btn-add"
          onPress={handleAddItem}
        />
      </View>

      <FlatList
        data={itemsWithGroups ?? []}
        keyExtractor={(row) => `item-${row.item.id}`}
        renderItem={({ item: row }) => (
          <View style={styles.row}>
            <Checkbox
              testID="todo-item-chbox"
              value={checkedIds.includes(row.item.id)}
              onValueChange={() => toggleChecked(row.item.id)}
            />
            <Text
              testID="todo-item-color"
              style={{ color: groupColors[row.group.position - 1] }}
            >
              ■{" "}
            </Text>
            <Text testID="todo-item-content" style={styles.text}>
              {row.item.content}
            </Text>
          </View>
        )}
      />
    </View>
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
