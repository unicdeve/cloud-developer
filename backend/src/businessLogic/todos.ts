import * as uuid from 'uuid'
import { TodosAccess } from '../dataLayer/todosAccess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'

const todosAccess = new TodosAccess()

export const createTodo = async (
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> => {
  const itemId = uuid.v4()

  return await todosAccess.createTodo({
    userId,
    todoId: itemId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false,
    createdAt: new Date().toISOString()
  })
}

export const getTodosForUser = async (userId: string): Promise<TodoItem[]> => {
  return await todosAccess.getUserTodos(userId)
}
