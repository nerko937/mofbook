import { FlatList, StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { todoGroups, todoItems, TodoGroup } from '../../db/schema';
import { db } from '@/db/client';
import { eq } from 'drizzle-orm';

export default function App() {
  const { id } = useLocalSearchParams();
  const safeId = Array.isArray(id) ? Number(id[0]) : Number(id);

  const [newItemText, setNewItemText] = useState("");
  const [itemsTracker, refreshItemsTracker] = useState(false)

  const { data: itemsAndGroups } = useLiveQuery(
    db.select({
      item: todoItems,
      group: todoGroups,
    })
    .from(todoGroups)
    .leftJoin(todoItems, eq(todoItems.groupId, todoGroups.id))
    .where(eq(todoGroups.todoId, safeId))
    .orderBy(todoGroups.position, todoItems.position),
    [itemsTracker]
  );

  const [selectedGroup, setSelectedGroup] = useState<TodoGroup | undefined>()
  const [groupSelectIsOpen, setGroupSelectIsOpen] = useState(false)
  useEffect(() => {
    if (selectedGroup) return;
    if (!itemsAndGroups) return;
    setSelectedGroup(itemsAndGroups[-1]?.group)
    setGroupSelectIsOpen(true)
  }, [itemsAndGroups])

  const handleAddItem = async () => {
    if (!newItemText.trim()) return;
    if (!itemsAndGroups) return;
    if (!selectedGroup) return;

    await db.insert(todoItems).values({
      groupId: selectedGroup.id,
      content: newItemText,
      position: itemsAndGroups.length + 1
    })
    setNewItemText("");
    refreshItemsTracker(!itemsTracker)
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}><Text>Selected group: {selectedGroup?.id}</Text></View>
      <View style={styles.inputContainer}>
        {groupSelectIsOpen ? (
          <Button title="Group" onPress={() => {setGroupSelectIsOpen(false)}} />
        ) : (
          [...new Set(itemsAndGroups.map(el => el.group))].map((group) => (
            <Button 
              key={group.id} 
              title={String(group.id)} 
              onPress={() => {setSelectedGroup(group);setGroupSelectIsOpen(true)}} 
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
        data={itemsAndGroups.filter(el => !!el)} 
        keyExtractor={(el) => {
          return `group${el.group.id}-item${el.item?.id}`;
        }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            {(item.group && item.item) ? (<Text style={styles.text}>{`${item.group.id} | ${item.item?.content}`}</Text>) : (undefined)}
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
  }
});
