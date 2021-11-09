import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import 'source-map-support/register'
import { deleteTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
import { getUserId, timeInMs } from '../utils'

const logger = createLogger('deleteTodo')

const cloudwatch = new AWS.CloudWatch()

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const startTime = timeInMs()
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
    } finally {
      const endTime = timeInMs()
      const totalTime = endTime - startTime
      // do not await this, not to keep the user waiting
      cloudwatch.putMetricData({
        MetricData: [
          {
            MetricName: 'Success',
            Dimensions: [
              {
                Name: 'ServiceName',
                Value: 'DeleteTodoAPI'
              }
            ],
            Unit: 'Milliseconds',
            Value: totalTime
          }
        ],
        Namespace: 'Capstone/Serveless'
      })
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
