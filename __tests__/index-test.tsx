import { render, screen, userEvent } from '@testing-library/react-native';
import { useTodos } from '@/hooks/useTodos';
import App from '@/app/index';

jest.mock('@/hooks/useTodos', () => ({
  useTodos: jest.fn(),
}));

const mockUseTodos = jest.mocked(useTodos);

describe('<App />', () => {
  beforeEach(() => {
    mockUseTodos.mockReturnValue({
      fetchedTodos: [],
      addTodo: jest.fn(),
    });
  });

  test('calls addTodo when user adds a todo', async () => {
    const addTodo = jest.fn();
    mockUseTodos.mockReturnValue({
      fetchedTodos: [],
      addTodo,
    });

    const user = userEvent.setup();
    await render(<App />);
    expect(screen.queryAllByTestId('todo-row')).toHaveLength(0);

    await user.type(screen.getByTestId('todo-input'), 'new todo');
    await user.press(screen.getByTestId('todo-btn-add'));

    expect(addTodo).toHaveBeenCalledWith('new todo');
  });

  test('renders todos from the hook and has correct href', async () => {
    mockUseTodos.mockReturnValue({
      fetchedTodos: [{ id: 42, name: 'new todo', createdAt: '2026-01-01' }],
      addTodo: jest.fn(),
    });

    await render(<App />);
    const todoRow = screen.getByTestId('todo-row');
    expect(todoRow).toHaveTextContent('new todo');
    expect(todoRow).toHaveProp('href', '/todos/42');
  });
});
