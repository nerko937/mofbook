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
  const [todos, setTodos] = useState([
    "chleb", "masło", "mleko"
  ]);
  const insets = useSafeAreaInsets();

  const handleAddTodo = (content: string) => {
    setTodos([...todos, content]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={40}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        { todos.map((todo, index) => (<Todo key={`${todo}-${index}`} content={ todo } />)) }
      </ScrollView>
      <View style={[styles.inputContainer, { paddingBottom: insets.bottom }]}>
        <TodoInput onAdd={handleAddTodo} />
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
