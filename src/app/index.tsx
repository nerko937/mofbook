import { FlatList, StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { useState } from 'react';
import { Link } from 'expo-router';
import { useTodos } from '@/hooks/useTodos';

export default function App() {
  const [newTodoName, setNewTodoName] = useState('');
  const { fetchedTodos, addTodo } = useTodos();

  const handleAddTodo = async () => {
    await addTodo(newTodoName);
    setNewTodoName('');
  };

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
            testID="todo-row"
            style={styles.row}
            href={{
              pathname: '/todos/[id]',
              params: { id: item.id },
            }}
            asChild
          >
            <Text style={styles.text}>{item.name}</Text>
          </Link>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          testID="todo-input"
          style={styles.input}
          value={newTodoName}
          onChangeText={setNewTodoName}
          onSubmitEditing={handleAddTodo}
        />
        <Button testID="todo-btn-add" title="Add" onPress={handleAddTodo} />
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
  },
});
