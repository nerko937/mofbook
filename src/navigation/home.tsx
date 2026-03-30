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

const Home = () => {
  const [todos, setTodos] = useState<string[]>([]);
  const insets = useSafeAreaInsets();

  const handleAddTodo = (content: string) => {
    setTodos([...todos, content]);
  };

  const handleDeleteTodo = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index));
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
            key={ `${todo}-${index}` }
            content={ todo }
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
