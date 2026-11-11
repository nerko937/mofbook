import { FlatList, StyleSheet } from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useState, useEffect, useCallback, useLayoutEffect } from "react";
import type { TodoGroup } from "../../db/schema";
import { useTodoItems, useTodo } from "@/hooks/todos";
import TextSubmitter from "@/components/ui/TextSubmitter";
import TodoItemRow from "@/components/todo-details/TodoItemRow";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import GroupPicker from "@/components/todo-details/GroupPicker";
import HeaderRight from "@/components/todo-details/HeaderRight";

export default function TodoDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const safeId = Number(id);

  const navigation = useNavigation();
  const { getTodo, deleteTodo } = useTodo();
  const { fetchedItems, addTodoItem, deleteTodoItems } = useTodoItems(safeId);

  const [selectedGroup, setSelectedGroup] = useState<TodoGroup | undefined>();
  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    void (async () => {
      const todo = await getTodo(safeId);
      if (!todo) throw new Error("Todo not exist.");
      navigation.setOptions({
        headerTitle: todo.name,
      });
    })();
  }, [safeId, getTodo, navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderRight
          selectedCount={checkedIds.length}
          onDeleteSelected={async () => {
            await deleteTodoItems(checkedIds);
            setCheckedIds([]);
          }}
          onDeleteTodo={() => setDeleteModalOpen(true)}
        />
      ),
    });
  }, [checkedIds, deleteTodoItems, navigation]);

  const toggleItem = useCallback((id: number) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const handleAddItem = async (text: string) => {
    if (!selectedGroup) return;

    await addTodoItem({
      content: text,
      groupId: selectedGroup.id,
    });
  };

  return (
    <>
      <FlatList
        style={styles.list}
        data={fetchedItems ?? []}
        keyExtractor={(row) => row.item.id.toString()}
        renderItem={({ item: row }) => (
          <TodoItemRow
            row={row}
            isChecked={checkedIds.includes(row.item.id)}
            onToggle={toggleItem}
          />
        )}
      />

      <GroupPicker
        todoId={safeId}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
      />
      <TextSubmitter externalHandler={handleAddItem} />

      <ConfirmationModal
        visible={deleteModalOpen}
        onConfirmation={async () => {
          await deleteTodo(safeId);
          setDeleteModalOpen(false);
          router.replace("/");
        }}
        onDismiss={() => setDeleteModalOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});
