import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme';

type TodoProps = {
  content: string;
  checked: boolean;
  onToggleCheck: () => void;
  onDelete: () => void;
}

const Todo = (props: TodoProps) => {
  const handleCheckboxPress = () => {
    props.onToggleCheck();
  };

  return (
    <View style={ styles.container }>
      <TouchableOpacity
        style={ styles.checkboxTextContainer }
        onPress={ handleCheckboxPress }
        accessibilityRole="checkbox"
        accessibilityState={ { checked: props.checked } }
      >
        <View style={ [styles.checkbox, props.checked && styles.checkboxChecked] }>
          { props.checked && <Text style={ styles.checkmark }>✓</Text> }
        </View>
        <Text style={ [styles.text, props.checked && styles.textChecked] }>
          { props.content }
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={ styles.trashButton } onPress={ props.onDelete }>
        <Text style={ styles.trashIcon }>×</Text>
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
  },
  checkboxTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: theme.colors.overlay1,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.overlay1,
    borderColor: theme.colors.overlay1,
  },
  checkmark: {
    color: theme.colors.background,
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: theme.colors.background,
  },
  text: {
    color: theme.colors.text,
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
  },
  textChecked: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  trashButton: {
    marginLeft: 12,
    padding: 4,
  },
  trashIcon: {
    fontSize: 24,
    color: theme.colors.overlay1,
    fontWeight: '300',
  },
});

export default Todo;
