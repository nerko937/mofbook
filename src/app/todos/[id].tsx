import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Button,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import type { TodoGroup } from "../../db/schema";
import { useTodoItems, useTodos } from "@/hooks/todos";
import TextSubmitter from "@/components/ui/TextSubmitter";
import TodoItemRow from "@/components/todo-details/TodoItemRow";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import GroupPicker from "@/components/todo-details/GroupPicker";

export default function TodoDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const safeId = Number(id);

  const { fetchedItems, addTodoItem, deleteTodoItems } = useTodoItems(safeId);

  const [selectedGroup, setSelectedGroup] = useState<TodoGroup | undefined>();

  const handleAddItem = async (text: string) => {
    if (!selectedGroup) return;

    await addTodoItem({
      content: text,
      groupId: selectedGroup.id,
    });
  };

  const [checkedIds, setCheckedIds] = useState<number[]>([]);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { deleteTodo } = useTodos();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Button
        testID="delete-todo-btn-modal-opn"
        title="Delete whole todo"
        color="red"
        onPress={() => setDeleteModalOpen(true)}
      />
      {checkedIds.length > 0 && (
        <View style={styles.selectionBar}>
          <Text>Selected items: {checkedIds.length}</Text>
          <Button
            testID="delete-items-btn-del-checked"
            title="Delete Selected"
            color="red"
            onPress={async () => {
              await deleteTodoItems(checkedIds);
              setCheckedIds([]);
            }}
          />
        </View>
      )}

      <View style={styles.inputContainer}>
        <GroupPicker
          todoId={safeId}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
        />
        <TextSubmitter externalHandler={handleAddItem} />
      </View>

      <FlatList
        data={fetchedItems ?? []}
        keyExtractor={(row) => row.item.id.toString()}
        renderItem={({ item: row }) => (
          <TodoItemRow
            row={row}
            checkedIds={checkedIds}
            setCheckedIds={setCheckedIds}
          />
        )}
      />

      <ConfirmationModal
        visible={deleteModalOpen}
        onConfirmation={async () => {
          await deleteTodo(safeId);
          setDeleteModalOpen(false);
          router.replace("/");
        }}
        onDismiss={() => setDeleteModalOpen(false)}
      />
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
  modalText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  selectionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
});
