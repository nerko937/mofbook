import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { useState, useRef } from 'react';
import { theme } from '../theme';

type TodoInputProps = {
  onAdd: (content: string) => void;
  disabled?: boolean;
}

const TodoInput = (props: TodoInputProps) => {
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handleAdd = () => {
    if (text.trim() && !props.disabled) {
      props.onAdd(text.trim());
      setText('');
      inputRef.current?.focus();
    }
  };

  return (
    <View style={ styles.container }>
      <TextInput
        ref={ inputRef }
        style={ styles.input }
        placeholder="Add new todo..."
        placeholderTextColor={ theme.colors.overlay1 }
        value={ text }
        onChangeText={ setText }
        onSubmitEditing={ handleAdd }
        returnKeyType="done"
        submitBehavior='submit'
        editable={ !props.disabled }
      />
      <TouchableOpacity
        style={ styles.button }
        onPress={ handleAdd }
        disabled={ !text.trim() || props.disabled }
      >
        <Text
          style={ [
            styles.buttonText,
            (!text.trim() || props.disabled) && styles.buttonTextDisabled,
          ] }
        >
          Add
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 16,
    lineHeight: 24,
    paddingVertical: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  buttonText: {
    color: theme.colors.overlay1,
    fontSize: 16,
    fontWeight: '400',
  },
  buttonTextDisabled: {
    opacity: 0.3,
  },
});

export default TodoInput;
