import { FlatList, StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import type { TodoGroup } from '../../db/schema';
import { useTodoItems } from '@/hooks/useTodoItems';

export default function App() {
  const { id } = useLocalSearchParams();
  const safeId = Array.isArray(id) ? Number(id[0]) : Number(id);

  const [newItemText, setNewItemText] = useState('');
  const { groups, itemsWithGroups, addItem } = useTodoItems(safeId);

  const uniqueGroups = groups ?? [];

  const [selectedGroup, setSelectedGroup] = useState<TodoGroup | undefined>();
  const [groupSelectIsOpen, setGroupSelectIsOpen] = useState(false);
  useEffect(() => {
    if (selectedGroup) return;
    if (!groups?.length) return;
    setSelectedGroup(groups[0]);
    setGroupSelectIsOpen(true);
  }, [groups, selectedGroup]);

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
      <View style={styles.header}>
        <Text>Selected group: {selectedGroup?.id}</Text>
      </View>
      <View style={styles.inputContainer}>
        {groupSelectIsOpen ? (
          <Button title="Group" onPress={() => setGroupSelectIsOpen(false)} />
        ) : (
          uniqueGroups.map((group) => (
            <Button
              key={group.id}
              title={String(group.id)}
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
            <Text style={styles.text}>
              {`${row.group.id} | ${row.item.content}`}
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
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  text: {
    fontSize: 16,
  },
});
