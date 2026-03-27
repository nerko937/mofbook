import { View } from 'react-native';
import Todo from '../components/todo'

const mockTodos = [
    "chleb", "masło", "mleko"
]

const Home = () => {
    return (
        <View>
            {mockTodos.map(todo => (<Todo content={todo}/>))}
        </View>
    )
}


export default Home
