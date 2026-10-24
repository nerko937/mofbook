import { Modal, FlatList, Alert, StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { useState } from 'react';
import { Link } from 'expo-router';
import { todos, NewTodo, todoGroups } from '../db/schema';
import { db } from '../db/client';

export default function App() {
  const [todoItems, setTodos] = useState<NewTodo[]>([]);
  const [newTodoName, setNewTodoName] = useState("");

  const handleAddTodo = async () => {
    if (!newTodoName.trim()) return;
    try {
      const [newTodo] = await db.insert(todos).values({name: newTodoName}).returning();
      await db.insert(todoGroups).values({todoId: newTodo.id, position: 1})
      setTodos((prev) => [...prev, newTodo]);
      setNewTodoName("");
    } catch (e) {
      console.error("Error adding todo:", e);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Todos</Text>

      <FlatList 
        data={todoItems} 
        keyExtractor={(todo) => {
          if (!todo.id) {
            throw new Error(`Todo doesn't have id, item data: ${JSON.stringify(todo)}`);
          }
          return todo.id.toString();
        }}
        renderItem={({ item }) => (
          <Link
            style={styles.row}
            href={{
              pathname: "/todos/[id]",
              params: { id: item.id! }
            }}
            asChild
          >
            <Text style={styles.text}>{item.name}</Text>
          </Link>
        )}
      />
      
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input}
          // placeholder="Add a new item..."
          value={newTodoName}
          onChangeText={setNewTodoName}
          onSubmitEditing={handleAddTodo}
        />
        <Button title="Add" onPress={handleAddTodo} />
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
