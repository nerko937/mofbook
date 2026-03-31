import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Todo from '../components/todo';
import TodoInput from '../components/todo-input';
import TabBar, { TabItem } from '../components/tab-bar';
import { theme } from '../theme';

type TodoItem = {
  content: string;
  checked: boolean;
}

type TabData = {
  id: string;
  name: string;
  todos: TodoItem[];
  isNaming: boolean;
}

const Home = () => {
  const [tabs, setTabs] = useState<TabData[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (tabs.length === 0) {
      const newTab: TabData = {
        id: Date.now().toString(),
        name: '',
        todos: [],
        isNaming: true,
      };
      setTabs([newTab]);
      setActiveTabId(newTab.id);
    }
  }, [tabs.length]);

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  const handleTabNameSubmit = (id: string, name: string) => {
    setTabs(tabs.map(tab =>
      tab.id === id ? { ...tab, name, isNaming: false } : tab
    ));
  };

  const handleTabPress = (id: string) => {
    setActiveTabId(id);
  };

  const handleTabClose = (id: string) => {
    const tabToClose = tabs.find(tab => tab.id === id);
    
    if (tabToClose?.isNaming) {
      const newTabs = tabs.filter(tab => tab.id !== id);
      setTabs(newTabs);
      
      if (activeTabId === id) {
        if (newTabs.length > 0) {
          setActiveTabId(newTabs[0].id);
        } else {
          setActiveTabId(null);
        }
      }
      return;
    }

    Alert.alert(
      'Delete Tab',
      'Are you sure you want to delete this tab? All todos in this tab will be lost.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const newTabs = tabs.filter(tab => tab.id !== id);
            setTabs(newTabs);

            if (activeTabId === id) {
              if (newTabs.length > 0) {
                setActiveTabId(newTabs[0].id);
              } else {
                setActiveTabId(null);
              }
            }
          },
        },
      ]
    );
  };

  const handleNewTab = () => {
    const newTab: TabData = {
      id: Date.now().toString(),
      name: '',
      todos: [],
      isNaming: true,
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const handleAddTodo = (content: string) => {
    if (!activeTabId) return;

    setTabs(tabs.map(tab =>
      tab.id === activeTabId
        ? { ...tab, todos: [...tab.todos, { content, checked: false }] }
        : tab
    ));
  };

  const handleDeleteTodo = (index: number) => {
    if (!activeTabId) return;

    setTabs(tabs.map(tab =>
      tab.id === activeTabId
        ? { ...tab, todos: tab.todos.filter((_, i) => i !== index) }
        : tab
    ));
  };

  const handleToggleCheck = (index: number) => {
    if (!activeTabId) return;

    setTabs(tabs.map(tab =>
      tab.id === activeTabId
        ? {
          ...tab,
          todos: tab.todos.map((todo, i) =>
            i === index ? { ...todo, checked: !todo.checked } : todo
          ),
        }
        : tab
    ));
  };

  const tabItems: TabItem[] = tabs.map(tab => ({
    id: tab.id,
    name: tab.name,
    isNaming: tab.isNaming,
  }));

  const hasNamingTab = tabs.some(tab => tab.isNaming);

  return (
    <KeyboardAvoidingView
      style={ styles.container }
      behavior={ Platform.OS === 'ios' ? 'padding' : 'height' }
      keyboardVerticalOffset={ 30 }
    >
      <TabBar
        tabs={ tabItems }
        activeTabId={ activeTabId }
        onTabPress={ handleTabPress }
        onTabClose={ handleTabClose }
        onTabNameSubmit={ handleTabNameSubmit }
        onNewTab={ handleNewTab }
      />
      <ScrollView
        style={ styles.scrollView }
        contentContainerStyle={ styles.scrollContent }
        keyboardShouldPersistTaps="handled"
      >
        { activeTab?.todos.map((todo, index) => (
          <Todo
            key={ index }
            content={ todo.content }
            checked={ todo.checked }
            onToggleCheck={ () => handleToggleCheck(index) }
            onDelete={ () => handleDeleteTodo(index) }
          />
        )) }
      </ScrollView>
      <View style={ [styles.inputContainer, { paddingBottom: insets.bottom + 12 }] }>
        <TodoInput onAdd={ handleAddTodo } disabled={ hasNamingTab } />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 12,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.surface1,
  },
});

export default Home;
