import {
  FlatList,
  StyleSheet,
  Button,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useState, useEffect } from "react";
import type { TodoGroup } from "../../db/schema";
import { useTodoItems, useTodos } from "@/hooks/todos";
import TextSubmitter from "@/components/ui/TextSubmitter";
import TodoItemRow from "@/components/todo-details/TodoItemRow";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import GroupPicker from "@/components/todo-details/GroupPicker";

export default function TodoDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const safeId = Number(id);

  const navigation = useNavigation();
  const { getTodo, deleteTodo } = useTodos();
  const { fetchedItems, addTodoItem, deleteTodoItems } = useTodoItems(safeId);

  const [selectedGroup, setSelectedGroup] = useState<TodoGroup | undefined>();
  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const DeleteAllButton = () => (
    <Button
      testID="delete-todo-btn-modal-opn"
      title="Delete whole todo"
      color="red"
      onPress={() => setDeleteModalOpen(true)}
    />
  );

  useEffect(() => {
    void (async () => {
      const todo = await getTodo(safeId);
      if (!todo) throw new Error("Todo not exist.");

      const selectionCount = checkedIds.length;
      navigation.setOptions({
        headerTitle: todo.name,
        headerRight: () =>
          selectionCount > 0 ? (
            <Button
              testID="delete-items-btn-del-checked"
              title={`Delete (${selectionCount})`}
              color="red"
              onPress={async () => {
                await deleteTodoItems(checkedIds);
                setCheckedIds([]);
              }}
            />
          ) : (
            <DeleteAllButton />
          ),
      });
    })();
  }, [safeId, checkedIds, navigation, getTodo, deleteTodoItems]);

  const handleAddItem = async (text: string) => {
    if (!selectedGroup) return;

    await addTodoItem({
      content: text,
      groupId: selectedGroup.id,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <GroupPicker
        todoId={safeId}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
      />
      <TextSubmitter externalHandler={handleAddItem} />

      <FlatList
        style={styles.list}
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
  list: {
    flex: 1,
  },
});
