import { FlatList, StyleSheet, Text, View } from 'react-native';

const data = [1,2,3]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function HomeScreen() {
    const renderItem = ({ item }: { item: number }) => (<View><Text>{item}</Text></View>);

  return (
    <View style={styles.container}>
      <FlatList data={data} renderItem={renderItem}/>
    </View>
  );
}


