import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { StyleSheet, View, Button, Modal } from "react-native";
import { TodoGroup } from "@/db/schema";
import { groupColors } from "@/group-colors";
import { useTodoGroups } from "@/hooks/todos";

type GroupPickerProps = {
  todoId: number;
  selectedGroup: TodoGroup | undefined;
  setSelectedGroup: Dispatch<SetStateAction<TodoGroup | undefined>>;
};

const GroupPicker = ({
  todoId,
  selectedGroup,
  setSelectedGroup,
}: GroupPickerProps) => {
  const [groupSelectModalOpen, setGroupSelectModalOpen] = useState(false);

  const { fetchedGroups, addTodoGroup } = useTodoGroups(todoId);

  useEffect(() => {
    if (!fetchedGroups?.length) return;
    if (selectedGroup === undefined) setSelectedGroup(fetchedGroups.at(-1));
  }, [fetchedGroups, selectedGroup, setSelectedGroup]);

  const handleAddGroup = async () => {
    if (!fetchedGroups) return;
    if (fetchedGroups.length >= 10) return;
    const newGroup = await addTodoGroup({
      todoId: todoId,
      position: fetchedGroups.length + 1,
    });
    setSelectedGroup(newGroup);
  };

  return (
    <>
      <Button
        testID="group-picker-btn-change"
        title="Group"
        color={groupColors[(selectedGroup?.position ?? 1) - 1]}
        onPress={() => setGroupSelectModalOpen(true)}
      />
      <Modal
        transparent={true}
        visible={groupSelectModalOpen}
        onRequestClose={() => setGroupSelectModalOpen(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <Button
              testID="group-picker-btn-add"
              title="Add group"
              onPress={handleAddGroup}
            />
            {(fetchedGroups ?? []).map((group) => (
              <Button
                testID="group-picker-btn-select"
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
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    minWidth: 250,
    gap: 10,
  },
});

export default GroupPicker;
