import { FlatList, StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import type { TodoGroup } from '../../db/schema';
import { useTodoGroups, useTodoItems } from '@/hooks/todos';
import { groupColors }  from '../groupColors'

export default function TodoDetails() {
  const { id } = useLocalSearchParams();
  const safeId = Array.isArray(id) ? Number(id[0]) : Number(id);

  const [newItemText, setNewItemText] = useState('');
  const { itemsWithGroups, addTodoItem } = useTodoItems(safeId);
  const { fetchedGroups, addTodoGroup } = useTodoGroups(safeId)

  const groups = fetchedGroups ?? [];

  const [selectedGroup, setSelectedGroup] = useState<TodoGroup | undefined>();
  const [groupSelectIsOpen, setGroupSelectIsOpen] = useState(false);
  useEffect(() => {
    if (selectedGroup) return;
    if (!fetchedGroups?.length) return;
    setSelectedGroup(fetchedGroups[0]);
    setGroupSelectIsOpen(true);
  }, [fetchedGroups, selectedGroup]);

  const handleAddItem = async () => {
    if (!newItemText.trim() || !selectedGroup) return;

    await addTodoItem({
      groupId: selectedGroup.id,
      content: newItemText,
    });
    setNewItemText('');
  };

  const handleAddGroup = async () => {
    if (groups.length >= 10) return;
    const newGroup = await addTodoGroup({todoId: safeId, position: groups.length + 1})
    setSelectedGroup(newGroup)
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {groupSelectIsOpen ? (
          <Button testID='change-group-btn' title="Group" color={groupColors[(selectedGroup?.position ?? 1) - 1]} onPress={() => setGroupSelectIsOpen(false)} />
        ) : (
          groups.map((group) => (
            <Button
              testID='select-group-btn'
              title="Swtich to"
              key={group.id}
              color={groupColors[group.position - 1]}
              onPress={() => {
                setSelectedGroup(group);
                setGroupSelectIsOpen(true);
              }}
            />
          ))
        )}
        <Button testID='add-group-btn' title="Add group" onPress={handleAddGroup} />
        <TextInput
          style={styles.input}
          testID='todo-item-input'
          placeholder="Add a new item..."
          value={newItemText}
          onChangeText={setNewItemText}
          onSubmitEditing={handleAddItem}
        />
        <Button title="Add" testID='todo-item-btn-add' onPress={handleAddItem} />
      </View>

      <FlatList
        data={itemsWithGroups ?? []}
        keyExtractor={(row) => `item-${row.item.id}`}
        renderItem={({ item: row }) => (
          <View style={styles.row}>
            <Text testID='todo-item-color' style={{color: groupColors[row.group.position - 1]}}>■ </Text>
            <Text testID='todo-item-content' style={styles.text}>
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
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  text: {
    fontSize: 16,
  },
});
