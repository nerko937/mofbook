import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { checklists, checklistGroups, checklistItems, NewChecklistItem } from '../db/schema';
import { db } from '../db/client';

export default function App() {
  const [items, setItems] = useState<NewChecklistItem[]>([]);
  
  useEffect(() => {
    const setupAndLoadData = async () => {
      try {
        let existingItems = await db.select().from(checklistItems);
        if (existingItems.length === 0) {
          const [main] = await db.insert(checklists).values({ name: "main" }).returning({ id: checklists.id });
          const [group] = await db.insert(checklistGroups).values({ checklistId: main.id, position: 1 }).returning({ id: checklistGroups.id });
          
          existingItems = await db.insert(checklistItems).values([
            { groupId: group.id, content: "item 1", position: 1 },
            { groupId: group.id, content: "item 2", position: 2 },
            { groupId: group.id, content: "item 3", position: 3 },
          ]).returning();
        }
        setItems(existingItems);
      } catch (e) {
        console.error("Error loading database:", e);
      }
    };

    setupAndLoadData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Checklist</Text>
      <FlatList 
        data={items} 
        keyExtractor={(item) => {
          if (!item.id) {
            throw new Error(`Critical Error: Checklist item is missing an ID! Item data: ${JSON.stringify(item)}`);
          }
          return item.id.toString();
        }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.text}>{item.content}</Text>
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
  centerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
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
