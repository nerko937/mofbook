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
    backgroundColor: theme.colors.background,
  },
  text: {
    color: theme.colors.text,
  },
});

export default Todo;
