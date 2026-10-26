import { FlatList, StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import type { TodoGroup } from '../../db/schema';
import { useTodoGroups, useTodoItems } from '@/hooks/todos';

const colors = [
  "#3B82F6",
  "#22C55E",
  "#EF4444",
  "#F59E0B",
  "#8B5CF6",
  "#F97316",
  "#14B8A6",
  "#334155",
  "#F1F5F9",
  "#FFFFFF",
]

export default function TodoDetails() {
  const { id } = useLocalSearchParams();
  const safeId = Array.isArray(id) ? Number(id[0]) : Number(id);

  const [newItemText, setNewItemText] = useState('');
  const { itemsWithGroups, addItem } = useTodoItems(safeId);
  const { fetchedGroups } = useTodoGroups(safeId)

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

    await addItem({
      groupId: selectedGroup.id,
      content: newItemText,
    });
    setNewItemText('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {groupSelectIsOpen ? (
          <Button title="Group" color={colors[selectedGroup?.position ?? 0]} onPress={() => setGroupSelectIsOpen(false)} />
        ) : (
          groups.map((group) => (
            <Button
              title="Swtich to"
              key={group.id}
              color={colors[group.position]}
              onPress={() => {
                setSelectedGroup(group);
                setGroupSelectIsOpen(true);
              }}
            />
          ))
        )}
        <TextInput
          style={styles.input}
          placeholder="Add a new item..."
          value={newItemText}
          onChangeText={setNewItemText}
          onSubmitEditing={handleAddItem}
        />
        <Button title="Add" onPress={handleAddItem} />
      </View>

      <FlatList
        data={itemsWithGroups ?? []}
        keyExtractor={(row) => `item-${row.item.id}`}
        renderItem={({ item: row }) => (
          <View style={styles.row}>
            <Text style={{color: colors[row.group.position]}}>■ </Text>
            <Text style={styles.text}>
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
