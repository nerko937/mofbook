import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Todo from '../components/todo';
import TodoInput from '../components/todo-input';
import { theme } from '../theme';

type TodoItem = {
  content: string;
  checked: boolean;
}

const Home = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const insets = useSafeAreaInsets();

  const handleAddTodo = (content: string) => {
    setTodos([...todos, { content, checked: false }]);
  };

  const handleDeleteTodo = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  const handleToggleCheck = (index: number) => {
    setTodos(todos.map((todo, i) =>
      i === index ? { ...todo, checked: !todo.checked } : todo
    ));
  };

  return (
    <KeyboardAvoidingView
      style={ styles.container }
      behavior={ Platform.OS === 'ios' ? 'padding' : 'height' }
      keyboardVerticalOffset={ 30 }
    >
      <ScrollView
        style={ styles.scrollView }
        contentContainerStyle={ styles.scrollContent }
        keyboardShouldPersistTaps="handled"
      >
        { todos.map((todo, index) => (
          <Todo
            key={ index }
            content={ todo.content }
            checked={ todo.checked }
            onToggleCheck={ () => handleToggleCheck(index) }
            onDelete={ () => handleDeleteTodo(index) }
          />
        )) }
      </ScrollView>
      <View style={ [styles.inputContainer, { paddingBottom: insets.bottom + 12 }] }>
        <TodoInput onAdd={ handleAddTodo } />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 12,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.surface1,
  },
});

export default Home;
