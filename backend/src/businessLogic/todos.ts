import * as uuid from 'uuid'
import { TodosAccess } from '../dataLayer/todosAccess'
import { ImageAccess } from '../dataLayer/imageAccess'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todosAccess = new TodosAccess()
const imageAccess = new ImageAccess()

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

export async function updateTodo(
  todoId: string,
  updateTodoRequest: UpdateTodoRequest,
  userId: string
): Promise<TodoItem> {
  return await todosAccess.updateTodo(updateTodoRequest, todoId, userId)
}

export async function deleteTodo(todoId: string, userId: string) {
  return await todosAccess.deleteTodo(todoId, userId)
}

export async function createAttachmentPresignedUrl(
  todoId: string,
  userId: string
): Promise<string> {
  const url = await imageAccess.getUploadUrl(todoId)

  // Write final url to todo DB
  await todosAccess.updateTodoUrl(todoId, userId)
  return url
}
