import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('deleteTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', { event: event.body })
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)

    try {
      await deleteTodo(todoId, userId)
      return {
        statusCode: 204,
        body: `Successfully deleted todo with id ${todoId}`
      }
    } catch (e) {
      return {
        statusCode: 404,
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
