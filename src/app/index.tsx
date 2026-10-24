import { Modal, FlatList, Alert, StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { useState } from 'react';
import { Link } from 'expo-router';
import { todos, NewTodo, todoGroups } from '../db/schema';
import { db } from '@/db/client';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

export default function App() {
  const [newTodoName, setNewTodoName] = useState("");

  const { data: fetchedTodos } = useLiveQuery(
    db.select()
    .from(todos)
    .orderBy(todos.createdAt),
  );

  const handleAddTodo = async () => {
    if (!newTodoName.trim()) return;
    const [{id}] = await db.insert(todos).values({name: newTodoName}).returning({id: todos.id});
    await db.insert(todoGroups).values({todoId: id, position: 1})
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Todos</Text>

      <FlatList 
        data={fetchedTodos} 
        keyExtractor={(todo) => {
          if (!todo.id) {
            throw new Error(`Todo doesn't have id, item data: ${JSON.stringify(todo)}`);
          }
          return todo.id.toString();
        }}
        renderItem={({ item }) => (
          <Link
            testID='todo-row'
            style={styles.row}
            href={{
              pathname: "/todos/[id]",
              params: { id: item.id }
            }}
            asChild
          >
            <Text style={styles.text}>{item.name}</Text>
          </Link>
        )}
      />
      
      <View style={styles.inputContainer}>
        <TextInput 
          testID='todo-input'
          style={styles.input}
          // placeholder="Add a new item..."
          value={newTodoName}
          onChangeText={setNewTodoName}
          onSubmitEditing={handleAddTodo}
        />
        <Button testID='todo-btn-add' title="Add" onPress={handleAddTodo} />
      </View>

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
