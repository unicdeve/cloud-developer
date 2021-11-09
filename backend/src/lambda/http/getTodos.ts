import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import 'source-map-support/register'
import { getTodosForUser } from '../../businessLogic/todos'
import { getUserId, timeInMs } from '../utils'

const cloudwatch = new AWS.CloudWatch()

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const startTime = timeInMs()
    const userId = getUserId(event)

    try {
      const todos = await getTodosForUser(userId)

      return {
        statusCode: 200,
        body: JSON.stringify({
          todos
        })
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
                Value: 'GetTodoAPI'
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

handler.use(
  cors({
    credentials: true
  })
)
