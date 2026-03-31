import { render, screen, fireEvent, waitFor, act } from '@testing-library/react-native';
import Home from '../src/navigation/home';
import { Alert } from 'react-native';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

describe('Tab Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('shows inline tab name input on initial render', () => {
      render(<Home />);
      expect(screen.getByPlaceholderText('Tab name...')).toBeTruthy();
    });

    it('creates first tab when name is submitted', () => {
      render(<Home />);
      const input = screen.getByPlaceholderText('Tab name...');

      fireEvent.changeText(input, 'My First Tab');
      fireEvent(input, 'submitEditing');

      expect(screen.getByText('My First Tab')).toBeTruthy();
    });

    it('does not create tab with empty name on submit', () => {
      render(<Home />);
      const input = screen.getByPlaceholderText('Tab name...');

      fireEvent(input, 'submitEditing');

      expect(screen.getByPlaceholderText('Tab name...')).toBeTruthy();
    });

    it('trims whitespace from tab name', () => {
      render(<Home />);
      const input = screen.getByPlaceholderText('Tab name...');

      fireEvent.changeText(input, '  Trimmed Tab  ');
      fireEvent(input, 'submitEditing');

      expect(screen.getByText('Trimmed Tab')).toBeTruthy();
    });

    it('submits tab name on plus button press', () => {
      render(<Home />);
      const input = screen.getByPlaceholderText('Tab name...');

      fireEvent.changeText(input, 'Tab Name');
      
      const submitButtons = screen.getAllByText('+');
      const submitButton = submitButtons[0];
      fireEvent.press(submitButton);

      expect(screen.getByText('Tab Name')).toBeTruthy();
    });

    it('shows plus button when naming tab', () => {
      render(<Home />);
      
      const plusButtons = screen.getAllByText('+');
      expect(plusButtons.length).toBeGreaterThan(0);
    });

    it('plus button does not submit empty name', () => {
      render(<Home />);
      
      const submitButtons = screen.getAllByText('+');
      const submitButton = submitButtons[0];
      fireEvent.press(submitButton);

      expect(screen.getByPlaceholderText('Tab name...')).toBeTruthy();
      expect(screen.queryByText('')).toBeNull();
    });
  });

  describe('Tab Management', () => {
    it('creates multiple tabs', () => {
      render(<Home />);

      fireEvent.changeText(screen.getByPlaceholderText('Tab name...'), 'Tab 1');
      fireEvent(screen.getByPlaceholderText('Tab name...'), 'submitEditing');

      const newTabButton = screen.getByText('+');
      fireEvent.press(newTabButton);

      fireEvent.changeText(screen.getByPlaceholderText('Tab name...'), 'Tab 2');
      fireEvent(screen.getByPlaceholderText('Tab name...'), 'submitEditing');

      expect(screen.getByText('Tab 1')).toBeTruthy();
      expect(screen.getByText('Tab 2')).toBeTruthy();
    });

    it('switches between tabs', () => {
      render(<Home />);

      fireEvent.changeText(screen.getByPlaceholderText('Tab name...'), 'Tab 1');
      fireEvent(screen.getByPlaceholderText('Tab name...'), 'submitEditing');

      const input = screen.getByPlaceholderText('Add new todo...');
      fireEvent.changeText(input, 'Todo in Tab 1');
      fireEvent.press(screen.getByText('Add'));

      const newTabButton = screen.getByText('+');
      fireEvent.press(newTabButton);

      fireEvent.changeText(screen.getByPlaceholderText('Tab name...'), 'Tab 2');
      fireEvent(screen.getByPlaceholderText('Tab name...'), 'submitEditing');

      const tab1 = screen.getByText('Tab 1');
      fireEvent.press(tab1);

      expect(screen.getByText('Todo in Tab 1')).toBeTruthy();
    });

    it('shows new tab button when tabs exist', () => {
      render(<Home />);

      fireEvent.changeText(screen.getByPlaceholderText('Tab name...'), 'Tab 1');
      fireEvent(screen.getByPlaceholderText('Tab name...'), 'submitEditing');

      const newTabButton = screen.getByTestId('new-tab-button');
      expect(newTabButton).toBeTruthy();
    });

    it('disables new tab button when naming a tab', () => {
      render(<Home />);

      const newTabButton = screen.getByTestId('new-tab-button');
      expect(newTabButton.props.accessibilityState.disabled).toBe(true);
    });

    it('disables todo input when naming a tab', () => {
      render(<Home />);

      const input = screen.getByPlaceholderText('Add new todo...');
      expect(input.props.editable).toBe(false);
    });

    it('enables new tab and todo input after naming tab', () => {
      render(<Home />);

      fireEvent.changeText(screen.getByPlaceholderText('Tab name...'), 'Tab 1');
      fireEvent(screen.getByPlaceholderText('Tab name...'), 'submitEditing');

      const newTabButton = screen.getByTestId('new-tab-button');
      expect(newTabButton.props.accessibilityState.disabled).toBe(false);

      const input = screen.getByPlaceholderText('Add new todo...');
      expect(input.props.editable).toBe(true);
    });

    it('cannot switch tabs while naming a tab', () => {
      render(<Home />);

      fireEvent.changeText(screen.getByPlaceholderText('Tab name...'), 'Tab 1');
      fireEvent(screen.getByPlaceholderText('Tab name...'), 'submitEditing');

      const newTabButton = screen.getByTestId('new-tab-button');
      fireEvent.press(newTabButton);

      const tab1 = screen.getByText('Tab 1');
      const tab1Button = tab1.parent?.parent;
      
      expect(tab1Button?.props.accessibilityState.disabled).toBe(true);
      
      fireEvent.press(tab1);
      
      expect(screen.getByPlaceholderText('Tab name...')).toBeTruthy();
    });
  });

  describe('Tab Deletion', () => {
    beforeEach(() => {
      jest.spyOn(Alert, 'alert');
    });

    it('shows confirmation dialog when closing named tab', () => {
      render(<Home />);

      fireEvent.changeText(screen.getByPlaceholderText('Tab name...'), 'Tab 1');
      fireEvent(screen.getByPlaceholderText('Tab name...'), 'submitEditing');

      const closeButtons = screen.getAllByText('×');
      const tabCloseButton = closeButtons[0];
      fireEvent.press(tabCloseButton);

      expect(Alert.alert).toHaveBeenCalledWith(
        'Delete Tab',
        'Are you sure you want to delete this tab? All todos in this tab will be lost.',
        expect.any(Array)
      );
    });

    it('deletes tab when confirmed', async () => {
      render(<Home />);

      fireEvent.changeText(screen.getByPlaceholderText('Tab name...'), 'Tab 1');
      fireEvent(screen.getByPlaceholderText('Tab name...'), 'submitEditing');

      const closeButtons = screen.getAllByText('×');
      const tabCloseButton = closeButtons[0];
      fireEvent.press(tabCloseButton);

      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const deleteButton = alertCall[2].find((btn: any) => btn.text === 'Delete');
      
      await act(async () => {
        deleteButton.onPress();
      });

      expect(screen.queryByText('Tab 1')).toBeNull();
      expect(screen.getByPlaceholderText('Tab name...')).toBeTruthy();
    });

    it('does not delete tab when cancelled', () => {
      render(<Home />);

      fireEvent.changeText(screen.getByPlaceholderText('Tab name...'), 'Tab 1');
      fireEvent(screen.getByPlaceholderText('Tab name...'), 'submitEditing');

      const closeButtons = screen.getAllByText('×');
      const tabCloseButton = closeButtons[0];
      fireEvent.press(tabCloseButton);

      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const cancelButton = alertCall[2].find((btn: any) => btn.text === 'Cancel');
      if (cancelButton.onPress) {
        cancelButton.onPress();
      }

      expect(screen.getByText('Tab 1')).toBeTruthy();
    });

    it('returns to initial state when all tabs are deleted', async () => {
      render(<Home />);

      fireEvent.changeText(screen.getByPlaceholderText('Tab name...'), 'Tab 1');
      fireEvent(screen.getByPlaceholderText('Tab name...'), 'submitEditing');

      const closeButtons = screen.getAllByText('×');
      const tabCloseButton = closeButtons[0];
      fireEvent.press(tabCloseButton);

      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const deleteButton = alertCall[2].find((btn: any) => btn.text === 'Delete');
      
      await act(async () => {
        deleteButton.onPress();
      });

      expect(screen.getByPlaceholderText('Tab name...')).toBeTruthy();
    });

    it('switches to first tab when active tab is deleted', async () => {
      render(<Home />);

      fireEvent.changeText(screen.getByPlaceholderText('Tab name...'), 'Tab 1');
      fireEvent(screen.getByPlaceholderText('Tab name...'), 'submitEditing');

      fireEvent.press(screen.getByText('+'));

      fireEvent.changeText(screen.getByPlaceholderText('Tab name...'), 'Tab 2');
      fireEvent(screen.getByPlaceholderText('Tab name...'), 'submitEditing');

      const closeButtons = screen.getAllByText('×');
      const tab2CloseButton = closeButtons[1];
      fireEvent.press(tab2CloseButton);

      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      const deleteButton = alertCall[2].find((btn: any) => btn.text === 'Delete');
      
      await act(async () => {
        deleteButton.onPress();
      });

      expect(screen.getByText('Tab 1')).toBeTruthy();
      expect(screen.queryByText('Tab 2')).toBeNull();
    });
  });

  describe('Tab Accessibility', () => {
    it('sets correct accessibility role for tabs', () => {
      render(<Home />);

      fireEvent.changeText(screen.getByPlaceholderText('Tab name...'), 'Tab 1');
      fireEvent(screen.getByPlaceholderText('Tab name...'), 'submitEditing');

      const tab = screen.getByText('Tab 1').parent?.parent;
      expect(tab?.props.accessibilityRole).toBe('tab');
    });

    it('sets selected state for active tab', () => {
      render(<Home />);

      fireEvent.changeText(screen.getByPlaceholderText('Tab name...'), 'Tab 1');
      fireEvent(screen.getByPlaceholderText('Tab name...'), 'submitEditing');

      fireEvent.press(screen.getByText('+'));

      fireEvent.changeText(screen.getByPlaceholderText('Tab name...'), 'Tab 2');
      fireEvent(screen.getByPlaceholderText('Tab name...'), 'submitEditing');

      const tab2 = screen.getByText('Tab 2').parent?.parent;
      expect(tab2?.props.accessibilityState?.selected).toBe(true);

      fireEvent.press(screen.getByText('Tab 1'));

      const tab1 = screen.getByText('Tab 1').parent?.parent;
      expect(tab1?.props.accessibilityState?.selected).toBe(true);
    });
  });
});
