import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { TodoItem } from '../../models/TodoItem'

const logger = createLogger('updateTodos')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', { event: event.body })

    const todoId = event.pathParameters.todoId
    const todoData: UpdateTodoRequest = JSON.parse(event.body)
    const userId = getUserId(event)

    try {
      const updatedTodo: TodoItem = await updateTodo(todoId, todoData, userId)
      logger.info('updatedTodo: ', { updatedTodo })

      return {
        statusCode: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          updatedTodo
        })
      }
    } catch (e) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: `error ${e.message}`
      }
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
