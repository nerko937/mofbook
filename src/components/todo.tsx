import { View, Text } from 'react-native';

type TodoProps = {
    content: string;
}

const Todo = (props: TodoProps) => {
    return (
        <View><Text>{props.content}</Text></View>
    )
}


export default Todo
