import { render, screen, fireEvent } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Home from '../src/navigation/home';

const renderHome = () => {
  return render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 0, height: 0 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }}
    >
      <Home />
    </SafeAreaProvider>
  );
};

describe('Home', () => {
  it('starts with inline tab naming', () => {
    renderHome();
    expect(screen.getByPlaceholderText('Tab name...')).toBeTruthy();
  });

  it('adds new todo item and removes it', () => {
    renderHome();
    
    fireEvent.changeText(screen.getByPlaceholderText('Tab name...'), 'My Tab');
    fireEvent(screen.getByPlaceholderText('Tab name...'), 'submitEditing');
    
    const input = screen.getByPlaceholderText('Add new todo...');
    const addButton = screen.getByText('Add');
    
    fireEvent.changeText(input, 'Item to delete');
    fireEvent.press(addButton);
    
    expect(screen.getByText('Item to delete')).toBeTruthy();
    expect(input.props.value).toBe('');
    
    const deleteButtons = screen.getAllByText('×');
    fireEvent.press(deleteButtons[1]);
    
    expect(screen.queryByText('Item to delete')).toBeNull();
  });

  it('does not add empty todos', () => {
    renderHome();
    
    fireEvent.changeText(screen.getByPlaceholderText('Tab name...'), 'My Tab');
    fireEvent(screen.getByPlaceholderText('Tab name...'), 'submitEditing');
    
    fireEvent.changeText(screen.getByPlaceholderText('Add new todo...'), 'Valid todo');
    fireEvent.press(screen.getByText('Add'));
    
    expect(screen.getByText('Valid todo')).toBeTruthy();
    
    fireEvent.changeText(screen.getByPlaceholderText('Add new todo...'), '   ');
    fireEvent.press(screen.getByText('Add'));
    
    const deleteButtons = screen.queryAllByText('×');
    expect(deleteButtons).toHaveLength(2);
  });

  it('toggles checkbox and applies strikethrough when checked', () => {
    renderHome();
    
    fireEvent.changeText(screen.getByPlaceholderText('Tab name...'), 'My Tab');
    fireEvent(screen.getByPlaceholderText('Tab name...'), 'submitEditing');
    
    const input = screen.getByPlaceholderText('Add new todo...');
    const addButton = screen.getByText('Add');
    
    fireEvent.changeText(input, 'Test todo');
    fireEvent.press(addButton);
    
    const todoText = screen.getByText('Test todo');
    const checkbox = screen.getByRole('checkbox');
    
    let styles = Array.isArray(todoText.props.style)
      ? todoText.props.style.flat()
      : [todoText.props.style];
    
    let hasStrikethrough = styles.some(
      (style: any) => style && style.textDecorationLine === 'line-through'
    );
    expect(hasStrikethrough).toBe(false);
    expect(checkbox.props.accessibilityState.checked).toBe(false);
    
    fireEvent.press(checkbox);
    
    styles = Array.isArray(todoText.props.style)
      ? todoText.props.style.flat()
      : [todoText.props.style];
    
    hasStrikethrough = styles.some(
      (style: any) => style && style.textDecorationLine === 'line-through'
    );
    expect(hasStrikethrough).toBe(true);
    expect(checkbox.props.accessibilityState.checked).toBe(true);
    
    fireEvent.press(checkbox);
    
    styles = Array.isArray(todoText.props.style)
      ? todoText.props.style.flat()
      : [todoText.props.style];
    
    hasStrikethrough = styles.some(
      (style: any) => style && style.textDecorationLine === 'line-through'
    );
    expect(hasStrikethrough).toBe(false);
    expect(checkbox.props.accessibilityState.checked).toBe(false);
  });
});
