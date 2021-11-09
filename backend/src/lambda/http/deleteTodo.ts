import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import 'source-map-support/register'
import { deleteTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('deleteTodo')

const cloudwatch = new AWS.CloudWatch()

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', { event: event.body })
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)

    try {
      await deleteTodo(todoId, userId)
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
            Unit: 'Count',
            Value: 1
          }
        ],
        Namespace: 'Capstone/Serveless'
      })
      return {
        statusCode: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: `Successfully deleted todo with id ${todoId}`
      }
    } catch (e) {
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
            Unit: 'Count',
            Value: 0
          }
        ],
        Namespace: 'Capstone/Serveless'
      })

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
