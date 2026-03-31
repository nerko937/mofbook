import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import Tab from './tab';
import { theme } from '../theme';

export type TabItem = {
  id: string;
  name: string;
  isNaming?: boolean;
}

type TabBarProps = {
  tabs: TabItem[];
  activeTabId: string | null;
  onTabPress: (id: string) => void;
  onTabClose: (id: string) => void;
  onTabNameSubmit: (id: string, name: string) => void;
  onNewTab: () => void;
}

const TabBar = (props: TabBarProps) => {
  const hasNamingTab = props.tabs.some(tab => tab.isNaming);

  return (
    <View style={ styles.container }>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={ false }
        style={ styles.scrollView }
        contentContainerStyle={ styles.scrollContent }
      >
        { props.tabs.map((tab) => (
          <Tab
            key={ tab.id }
            name={ tab.name }
            isActive={ tab.id === props.activeTabId }
            isNaming={ tab.isNaming || false }
            onPress={ () => props.onTabPress(tab.id) }
            onClose={ () => props.onTabClose(tab.id) }
            onNameSubmit={ (name) => props.onTabNameSubmit(tab.id, name) }
            disabled={ hasNamingTab && !tab.isNaming }
          />
        )) }
        <TouchableOpacity
          style={ styles.newTabButton }
          onPress={ props.onNewTab }
          disabled={ hasNamingTab }
          testID="new-tab-button"
          accessibilityState={ { disabled: hasNamingTab } }
        >
          <Text
            style={ [
              styles.newTabIcon,
              hasNamingTab && styles.newTabIconDisabled,
            ] }
          >
            +
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface0,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface2,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    flexDirection: 'row',
    gap: 1,
    paddingHorizontal: 8,
  },
  newTabButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface0,
  },
  newTabIcon: {
    fontSize: 18,
    color: theme.colors.overlay1,
    fontWeight: '300',
  },
  newTabIconDisabled: {
    opacity: 0.3,
  },
});

export default TabBar;
