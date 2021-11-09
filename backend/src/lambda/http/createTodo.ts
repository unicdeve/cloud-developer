import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import 'source-map-support/register'
import { createTodo } from '../../businessLogic/todos'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId, timeInMs } from '../utils'

const cloudwatch = new AWS.CloudWatch()

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const startTime = timeInMs()
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    const userId = await getUserId(event)

    try {
      const newItem = await createTodo(newTodo, userId)

      return {
        statusCode: 201,
        body: JSON.stringify({
          newItem
        })
      }
    } catch (e) {
      return {
        statusCode: 400,
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
                Value: 'CreateTodoAPI'
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
