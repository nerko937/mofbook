import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { theme } from '../theme';

type TabProps = {
  name: string;
  isActive: boolean;
  isNaming: boolean;
  onPress: () => void;
  onClose: () => void;
  onNameSubmit: (name: string) => void;
  disabled?: boolean;
}

const Tab = (props: TabProps) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (props.isNaming) {
      inputRef.current?.focus();
    }
  }, [props.isNaming]);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      props.onNameSubmit(inputValue.trim());
      setInputValue('');
    }
  };

  if (props.isNaming) {
    return (
      <View style={ [styles.container, props.isActive && styles.containerActive] }>
        <TextInput
          ref={ inputRef }
          style={ styles.input }
          placeholder="Tab name..."
          placeholderTextColor={ theme.colors.overlay1 }
          value={ inputValue }
          onChangeText={ setInputValue }
          onSubmitEditing={ handleSubmit }
          returnKeyType="done"
          submitBehavior='submit'
        />
        <TouchableOpacity
          style={ styles.submitButton }
          onPress={ handleSubmit }
          disabled={ !inputValue.trim() }
          hitSlop={ { top: 8, bottom: 8, left: 4, right: 4 } }
        >
          <Text
            style={ [
              styles.submitIcon,
              props.isActive && styles.submitIconActive,
              !inputValue.trim() && styles.submitIconDisabled,
            ] }
          >
            +
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={ [styles.container, props.isActive && styles.containerActive] }>
      <TouchableOpacity
        style={ styles.tabButton }
        onPress={ props.onPress }
        disabled={ props.disabled }
        accessibilityRole="tab"
        accessibilityState={ { selected: props.isActive, disabled: props.disabled } }
      >
        <Text
          style={ [styles.tabText, props.isActive && styles.tabTextActive] }
          numberOfLines={ 1 }
        >
          { props.name }
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={ styles.closeButton }
        onPress={ props.onClose }
        hitSlop={ { top: 8, bottom: 8, left: 4, right: 4 } }
      >
        <Text style={ [styles.closeIcon, props.isActive && styles.closeIconActive] }>
          ×
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface0,
    paddingLeft: 12,
    paddingRight: 4,
    paddingVertical: 8,
    gap: 4,
    minWidth: 100,
    maxWidth: 200,
    borderTopWidth: 2,
    borderTopColor: 'transparent',
  },
  containerActive: {
    backgroundColor: theme.colors.background,
    borderTopColor: theme.colors.mauve,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 14,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  tabButton: {
    flex: 1,
    paddingRight: 4,
  },
  tabText: {
    color: theme.colors.overlay1,
    fontSize: 14,
    fontWeight: '400',
  },
  tabTextActive: {
    color: theme.colors.text,
    fontWeight: '500',
  },
  submitButton: {
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitIcon: {
    fontSize: 18,
    color: theme.colors.text,
    fontWeight: '300',
    lineHeight: 18,
  },
  submitIconActive: {
    color: theme.colors.text,
  },
  submitIconDisabled: {
    opacity: 0.3,
  },
  closeButton: {
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 18,
    color: theme.colors.overlay1,
    fontWeight: '300',
    lineHeight: 18,
  },
  closeIconActive: {
    color: theme.colors.overlay2,
  },
});

export default Tab;
