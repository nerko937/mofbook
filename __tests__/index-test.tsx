import { render, screen, userEvent } from '@testing-library/react-native';
import { setupTestDB } from '../test-utils/db'
import { db } from '@/db/client'
import { todos, todoGroups } from '@/db/schema';
import App from '@/app/index'

describe('<App />', () => {
  setupTestDB();

  test('basic flow', async () => {
    const user = userEvent.setup()
    await render(<App/>);
    expect(screen.queryAllByTestId('todo-row')).toHaveLength(0)

    await user.type(screen.getByTestId('todo-input'), "new todo")
    await user.press(screen.getByTestId('todo-btn-add'))
    expect(screen.getByTestId('todo-row')).toHaveTextContent("new todo")
  })

  test('renders pre existing and have correct href', async () => {
    const [{id}] = await db.insert(todos).values({name: "new todo"}).returning({id: todos.id})
    await db.insert(todoGroups).values({todoId: id, position: 1})
    await render(<App/>)
    const todoRow = screen.getByTestId('todo-row') 
    expect(todoRow).toHaveTextContent("new todo")
    expect(todoRow).toHaveProp('href', `/todos/${id}`)
  })
})
