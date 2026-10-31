import { screen, waitFor } from 'expo-router/testing-library';
import { useTodoGroups, useTodoItems, useTodos } from '@/hooks/todos';
import { groupColors } from '@/group-colors';
import { renderApp, setupUser } from '../helpers/router';

jest.mock('@/hooks/todos', () => ({
  useTodos: jest.fn(),
  useTodoGroups: jest.fn(),
  useTodoItems: jest.fn(),
}));

const mockUseTodos = jest.mocked(useTodos);
const mockUseTodoGroups = jest.mocked(useTodoGroups);
const mockUseTodoItems = jest.mocked(useTodoItems);

describe('<TodoDetails />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTodos.mockReturnValue({
      fetchedTodos: [],
      getTodo: jest.fn().mockResolvedValue({
        id: 1,
        name: 'Test todo',
        createdAt: '2026-01-01',
      }),
      addTodo: jest.fn(),
      deleteTodo: jest.fn(),
    });
    mockUseTodoGroups.mockReturnValue({
      fetchedGroups: [
        { id: 1, todoId: 1, position: 1 },
        { id: 2, todoId: 1, position: 2 },
      ],
      addTodoGroup: jest.fn(),
    });
    mockUseTodoItems.mockReturnValue({
      fetchedItems: [],
      addTodoItem: jest.fn(),
      deleteTodoItems: jest.fn(),
    });
  });

  test('adding todo items', async () => {
    const addTodoItem = jest.fn();
    mockUseTodoItems.mockReturnValue({
      fetchedItems: [],
      addTodoItem,
      deleteTodoItems: jest.fn(),
    });

    const user = setupUser();
    await renderApp('/todos/1');
    expect(screen.queryAllByTestId('todo-item-content')).toHaveLength(0);

    await user.type(screen.getByTestId('text-submitter-input'), 'todo 1');
    await user.press(screen.getByTestId('text-submitter-btn-submit'));

    expect(addTodoItem).toHaveBeenCalledWith({
      groupId: 1,
      content: 'todo 1',
    });

    await user.press(screen.getByTestId('group-picker-btn-change'));
    await user.press(screen.getAllByTestId('group-picker-btn-select')[1]);

    await user.type(screen.getByTestId('text-submitter-input'), 'todo 2');
    await user.press(screen.getByTestId('text-submitter-btn-submit'));

    expect(addTodoItem).toHaveBeenCalledWith({
      groupId: 2,
      content: 'todo 2',
    });
  });

  test('renders todo items with groups from the hook', async () => {
    mockUseTodoItems.mockReturnValue({
      fetchedItems: [
        {
          item: { id: 1, groupId: 1, content: 'todo 1', position: 1 },
          group: { id: 1, todoId: 1, position: 1 },
        },
        {
          item: { id: 2, groupId: 2, content: 'todo 2', position: 2 },
          group: { id: 2, todoId: 1, position: 2 },
        },
      ],
      addTodoItem: jest.fn(),
      deleteTodoItems: jest.fn(),
    });

    await renderApp('/todos/1');

    const contents = screen.getAllByTestId('todo-item-content');
    expect(contents).toHaveLength(2);
    expect(contents[0]).toHaveTextContent('todo 1');
    expect(contents[1]).toHaveTextContent('todo 2');

    const colors = screen.getAllByTestId('todo-item-color');
    expect(colors).toHaveLength(2);
    expect(colors[0]).toHaveStyle({ color: groupColors[0] });
    expect(colors[1]).toHaveStyle({ color: groupColors[1] });

    const checkboxes = screen.getAllByTestId('todo-item-chbox');
    expect(checkboxes).toHaveLength(2);
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  test('adding new group', async () => {
    const addTodoGroup = jest.fn();
    mockUseTodoGroups.mockReturnValue({
      fetchedGroups: [{ id: 1, todoId: 1, position: 1 }],
      addTodoGroup: addTodoGroup,
    });

    const user = setupUser();
    await renderApp('/todos/1');

    await user.press(screen.getByTestId('group-picker-btn-change'));
    await user.press(screen.getByTestId('group-picker-btn-add'));
    expect(addTodoGroup).toHaveBeenCalledWith({ todoId: 1, position: 2 });
  });

  test('deleting todo items', async () => {
    const deleteTodoItems = jest.fn();
    mockUseTodoItems.mockReturnValue({
      fetchedItems: [
        {
          item: { id: 1, groupId: 1, content: 'todo 1', position: 1 },
          group: { id: 1, todoId: 1, position: 1 },
        },
        {
          item: { id: 2, groupId: 2, content: 'todo 2', position: 2 },
          group: { id: 2, todoId: 1, position: 2 },
        },
        {
          item: { id: 3, groupId: 3, content: 'todo 3', position: 3 },
          group: { id: 3, todoId: 1, position: 3 },
        },
      ],
      addTodoItem: jest.fn(),
      deleteTodoItems: deleteTodoItems,
    });

    const user = setupUser();
    await renderApp('/todos/1');

    expect(screen.queryByTestId('delete-items-btn-del-checked')).toBe(null);

    const checkboxes = screen.getAllByTestId('todo-item-chbox');
    await user.press(checkboxes[0]);
    await user.press(checkboxes[1]);
    await user.press(screen.getByTestId('delete-items-btn-del-checked'));
    expect(deleteTodoItems).toHaveBeenCalledWith([1, 2]);
  });

  test('delete todo', async () => {
    const deleteTodo = jest.fn();
    mockUseTodos.mockReturnValue({
      fetchedTodos: [],
      getTodo: jest.fn().mockResolvedValue({
        id: 1,
        name: 'Test todo',
        createdAt: '2026-01-01',
      }),
      addTodo: jest.fn(),
      deleteTodo: deleteTodo,
    });

    const user = setupUser();
    await renderApp('/todos/1');

    const openDeleteModal = await waitFor(() =>
      screen.getByTestId('delete-todo-btn-modal-opn'),
    );
    await user.press(openDeleteModal);
    await user.press(screen.getByTestId('confirmation-modal-btn-dismiss'));
    expect(deleteTodo).not.toHaveBeenCalled();

    await user.press(openDeleteModal);
    await user.press(screen.getByTestId('confirmation-modal-btn-confirm'));
    expect(deleteTodo).toHaveBeenCalledWith(1);
    expect(screen).toHavePathname('/');
  });
});
