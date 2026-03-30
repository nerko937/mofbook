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
  it('starts with an empty list', () => {
    renderHome();
    const placeholder = screen.getByPlaceholderText('Add new todo...');
    expect(placeholder).toBeTruthy();
  });

  it('adds new todo item and removes it', () => {
    renderHome();
    
    const input = screen.getByPlaceholderText('Add new todo...');
    const addButton = screen.getByText('Add');
    
    fireEvent.changeText(input, 'Item to delete');
    fireEvent.press(addButton);
    
    expect(screen.getByText('Item to delete')).toBeTruthy();
    expect(input.props.value).toBe('');
    
    const deleteButtons = screen.getAllByText('×');
    fireEvent.press(deleteButtons[0]);
    
    expect(screen.queryByText('Item to delete')).toBeNull();
  });

  it('does not add empty todos', () => {
    renderHome();
    
    const input = screen.getByPlaceholderText('Add new todo...');
    const addButton = screen.getByText('Add');
    
    fireEvent.changeText(input, '   ');
    fireEvent.press(addButton);
    
    const deleteButtons = screen.queryAllByText('×');
    expect(deleteButtons).toHaveLength(0);
  });
});
