import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

type TodoProps = {
  content: string;
}

const Todo = (props: TodoProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{ props.content }</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface0,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 12,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.mauve,
    shadowColor: theme.colors.crust,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    color: theme.colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
});

export default Todo;
