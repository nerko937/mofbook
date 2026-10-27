import { render, screen, userEvent } from '@testing-library/react-native';
import { useTodoGroups, useTodoItems } from '@/hooks/todos';
import TodoDetails from '@/app/todos/[id]';
import { groupColors }  from '@/app/groupColors'

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(() => ({ id: '1' })),
}));

jest.mock('@/hooks/todos', () => ({
  useTodoGroups: jest.fn(),
  useTodoItems: jest.fn(),
}));

const mockUseTodoGroups = jest.mocked(useTodoGroups);
const mockUseTodoItems = jest.mocked(useTodoItems);

describe('<TodoDetails />', () => {
  beforeEach(() => {
    mockUseTodoGroups.mockReturnValue({
      fetchedGroups: [{ id: 1, todoId: 1, position: 1 }, { id: 2, todoId: 1, position: 2 }],
      addTodoGroup: jest.fn(),
    });
    mockUseTodoItems.mockReturnValue({
      itemsWithGroups: [],
      addTodoItem: jest.fn(),
    });
  });

  test('adding todo items', async () => {
    const addTodoItem = jest.fn();
    mockUseTodoItems.mockReturnValue({
      itemsWithGroups: [],
      addTodoItem,
    });

    const user = userEvent.setup();
    await render(<TodoDetails />);
    expect(screen.queryAllByTestId('todo-item-content')).toHaveLength(0);

    await user.type(screen.getByTestId('todo-item-input'), 'todo 1');
    await user.press(screen.getByTestId('todo-item-btn-add'));

    expect(addTodoItem).toHaveBeenCalledWith({
      groupId: 1,
      content: 'todo 1',
    });

    await user.press(screen.getByTestId('change-group-btn'))
    await user.press(screen.getAllByTestId('select-group-btn')[1])

    await user.type(screen.getByTestId('todo-item-input'), 'todo 2');
    await user.press(screen.getByTestId('todo-item-btn-add'));

    expect(addTodoItem).toHaveBeenCalledWith({
      groupId: 2,
      content: 'todo 2',
    });
  });

  test('renders todo items with groups from the hook', async () => {
    mockUseTodoItems.mockReturnValue({
      itemsWithGroups: [
        {
          item: { id: 1, groupId: 1, content: "todo 1", position: 1},
          group: { id: 1, todoId: 1, position: 1 }
        },
        {
          item: { id: 2, groupId: 2, content: "todo 2", position: 2},
          group: { id: 2, todoId: 1, position: 2 }
        }
      ],
      addTodoItem: jest.fn(),
    });

    await render(<TodoDetails />);

    const contents = screen.getAllByTestId('todo-item-content')
    expect(contents).toHaveLength(2)
    expect(contents[0]).toHaveTextContent('todo 1')
    expect(contents[1]).toHaveTextContent('todo 2')

    const colors = screen.getAllByTestId('todo-item-color')
    expect(colors).toHaveLength(2)
    expect(colors[0]).toHaveStyle({color: groupColors[0]})
    expect(colors[1]).toHaveStyle({color: groupColors[1]})
  })

  test('adding new group', async () => {
    const addTodoGroup = jest.fn()
    mockUseTodoGroups.mockReturnValue({
      fetchedGroups: [{ id: 1, todoId: 1, position: 1 }],
      addTodoGroup: addTodoGroup,
    });

    const user = userEvent.setup();
    await render(<TodoDetails />);

    await user.press(screen.getByTestId('add-group-btn'))
    expect(addTodoGroup).toHaveBeenCalled()
  })
})
