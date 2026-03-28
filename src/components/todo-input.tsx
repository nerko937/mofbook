import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useState } from 'react';
import { theme } from '../theme';

type TodoInputProps = {
  onAdd: (content: string) => void;
}

const TodoInput = (props: TodoInputProps) => {
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (text.trim()) {
      props.onAdd(text.trim());
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Add new todo..."
        placeholderTextColor={theme.colors.overlay1}
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleAdd}
        returnKeyType="done"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleAdd}
        disabled={!text.trim()}
      >
        <Text style={[styles.buttonText, !text.trim() && styles.buttonTextDisabled]}>
          Add
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface0,
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 12,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.blue,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 16,
    lineHeight: 24,
    paddingVertical: 4,
  },
  button: {
    backgroundColor: theme.colors.blue,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: theme.colors.base,
    fontSize: 14,
    fontWeight: '600',
  },
  buttonTextDisabled: {
    opacity: 0.5,
  },
});

export default TodoInput;
