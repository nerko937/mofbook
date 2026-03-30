import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme';

type TodoProps = {
  content: string;
  onDelete: () => void;
}

const Todo = (props: TodoProps) => {
  const handleCheckboxPress = () => {
    // Checkbox press logic will go here
  };

  return (
    <View style={ styles.container }>
      <TouchableOpacity
        style={ styles.checkboxTextContainer }
        onPress={ handleCheckboxPress }
      >
        <View style={ styles.checkbox }>
          <View style={ styles.checkboxInner } />
        </View>
        <Text style={ styles.text }>{ props.content }</Text>
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
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  text: {
    color: theme.colors.text,
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
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
