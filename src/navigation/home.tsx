import { View, StyleSheet } from 'react-native';
import { useState } from 'react';
import Todo from '../components/todo';
import TodoInput from '../components/todo-input';
import { theme } from '../theme';

const Home = () => {
  const [todos, setTodos] = useState([
    "chleb", "masło", "mleko"
  ]);

  const handleAddTodo = (content: string) => {
    setTodos([...todos, content]);
  };

  return (
    <View style={styles.container}>
      { todos.map((todo, index) => (<Todo key={`${todo}-${index}`} content={ todo } />)) }
      <TodoInput onAdd={handleAddTodo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});

export default Home;
