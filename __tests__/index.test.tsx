import { screen, waitFor } from 'expo-router/testing-library';
import { useTodoGroups, useTodoItems, useTodos } from '@/hooks/todos';
import { renderApp, setupUser } from './helpers/router';

jest.mock('@/hooks/todos', () => ({
  useTodos: jest.fn(),
  useTodoGroups: jest.fn(),
  useTodoItems: jest.fn(),
}));

const mockUseTodos = jest.mocked(useTodos);
const mockUseTodoGroups = jest.mocked(useTodoGroups);
const mockUseTodoItems = jest.mocked(useTodoItems);

describe('<Index />', () => {
  beforeEach(() => {
    mockUseTodos.mockReturnValue({
      fetchedTodos: [],
      getTodo: jest.fn(),
      addTodo: jest.fn(),
      deleteTodo: jest.fn(),
    });
    mockUseTodoGroups.mockReturnValue({
      fetchedGroups: [],
      addTodoGroup: jest.fn(),
    });
    mockUseTodoItems.mockReturnValue({
      fetchedItems: [],
      addTodoItem: jest.fn(),
      deleteTodoItems: jest.fn(),
    });
  });

  test('add todo', async () => {
    const addTodo = jest.fn();
    mockUseTodos.mockReturnValue({
      fetchedTodos: [],
      getTodo: jest.fn(),
      addTodo,
      deleteTodo: jest.fn(),
    });

    const user = setupUser();
    await renderApp('/');
    expect(screen.queryAllByTestId('todo-row')).toHaveLength(0);

    await user.type(screen.getByTestId('text-submitter-input'), 'new todo');
    await user.press(screen.getByTestId('text-submitter-btn-submit'));

    expect(addTodo).toHaveBeenCalledWith('new todo');
  });

  test('navigates to todo details when a row is pressed', async () => {
    const todo = { id: 42, name: 'new todo', createdAt: '2026-01-01' };
    mockUseTodos.mockReturnValue({
      fetchedTodos: [todo],
      getTodo: jest.fn().mockResolvedValue(todo),
      addTodo: jest.fn(),
      deleteTodo: jest.fn(),
    });

    const user = setupUser();
    await renderApp('/');
    expect(screen.getByTestId('todo-row')).toHaveTextContent('new todo');

    await user.press(screen.getByTestId('todo-row'));

    await waitFor(() => expect(screen).toHavePathname('/todos/42'));
  });
});
