import { View, Text } from 'react-native';
import { theme } from '../theme';

type TodoProps = {
  content: string;
}

const Todo = (props: TodoProps) => {
  return (
    <View style={ { backgroundColor: theme.colors.background } }>
      <Text style={{color: theme.colors.text}}>{ props.content }</Text>
    </View>
  );
};


export default Todo;
