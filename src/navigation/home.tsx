import { View, StyleSheet } from 'react-native';
import Todo from '../components/todo';
import { theme } from '../theme';

const mockTodos = [
  "chleb", "masło", "mleko"
];

const Home = () => {
  return (
    <View style={styles.container}>
      { mockTodos.map(todo => (<Todo key={ todo } content={ todo } />)) }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});

export default Home;
