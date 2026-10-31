import {
  Modal,
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
import { useTodoGroups, useTodoItems, useTodos } from "@/hooks/todos";
import { groupColors } from "@/groupColors";
import TextSubmitter from "@/components/ui/TextSubmitter";
import TodoItemRow from "@/components/TodoItemRow";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

export default function TodoDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const safeId = Number(id);

  const { fetchedItems, addTodoItem, deleteTodoItems } = useTodoItems(safeId);
  const { fetchedGroups, addTodoGroup } = useTodoGroups(safeId);

  const groups = fetchedGroups ?? [];

  const [selectedGroup, setSelectedGroup] = useState<TodoGroup | undefined>();
  const resolvedSelectedGroup = selectedGroup ?? groups[0];
  const [groupSelectModalOpen, setGroupSelectModalOpen] = useState(false);

  const handleAddItem = async (text: string) => {
    if (!resolvedSelectedGroup) return;

    await addTodoItem({
      content: text,
      groupId: resolvedSelectedGroup.id,
    });
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
        <Button
          testID="todo-group-btn-change"
          title="Group"
          color={groupColors[(resolvedSelectedGroup?.position ?? 1) - 1]}
          onPress={() => setGroupSelectModalOpen(true)}
        />
        <Modal
          transparent={true}
          visible={groupSelectModalOpen}
          onRequestClose={() => setGroupSelectModalOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Button
                testID="todo-group-btn-add"
                title="Add group"
                onPress={handleAddGroup}
              />
              {groups.map((group) => (
                <Button
                  testID="todo-group-btn-select"
                  title={`Switch to Group ${group.position}`}
                  key={group.id}
                  color={groupColors[group.position - 1]}
                  onPress={() => {
                    setSelectedGroup(group);
                    setGroupSelectModalOpen(false);
                  }}
                />
              ))}
              <Button
                title="Cancel"
                onPress={() => setGroupSelectModalOpen(false)}
              />
            </View>
          </View>
        </Modal>

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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    minWidth: 250,
    gap: 10,
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
