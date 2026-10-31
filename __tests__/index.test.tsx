import { render, screen, userEvent } from '@testing-library/react-native';
import { useTodos } from '@/hooks/todos';
import { Link } from 'expo-router';
import Index from '@/app/index';

jest.mock('@/hooks/todos', () => ({
  useTodos: jest.fn(),
}));

const mockUseTodos = jest.mocked(useTodos);

describe('<Index />', () => {
  beforeEach(() => {
    mockUseTodos.mockReturnValue({
      fetchedTodos: [],
      addTodo: jest.fn(),
      deleteTodo: jest.fn(),
    });
  });

  test('add todo', async () => {
    const addTodo = jest.fn();
    mockUseTodos.mockReturnValue({
      fetchedTodos: [],
      addTodo,
      deleteTodo: jest.fn(),
    });

    const user = userEvent.setup();
    await render(<Index />);
    expect(screen.queryAllByTestId('todo-row')).toHaveLength(0);

    await user.type(screen.getByTestId('text-submitter-input'), 'new todo');
    await user.press(screen.getByTestId('text-submitter-btn-submit'));

    expect(addTodo).toHaveBeenCalledWith('new todo');
  });

  test('renders todos from the hook and has correct href', async () => {
    const todo = { id: 42, name: 'new todo', createdAt: '2026-01-01' };
    mockUseTodos.mockReturnValue({
      fetchedTodos: [todo],
      addTodo: jest.fn(),
      deleteTodo: jest.fn(),
    });
    await render(<Index />);
    expect(screen.getByTestId('todo-row')).toHaveTextContent('new todo');
    expect(
      Link.resolveHref({
        pathname: '/todos/[id]',
        params: { id: todo.id },
      }),
    ).toBe('/todos/42');
  });
});
