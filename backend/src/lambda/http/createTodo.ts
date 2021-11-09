import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import 'source-map-support/register'
import { createTodo } from '../../businessLogic/todos'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { isEmpty } from '../../utils/isEmpty'
import { getUserId } from '../utils'

const cloudwatch = new AWS.CloudWatch()

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    const userId = await getUserId(event)
    const newItem = await createTodo(newTodo, userId)

    // do not await this, not to keep the user waiting
    cloudwatch
      .putMetricData({
        MetricData: [
          {
            MetricName: 'Success',
            Dimensions: [
              {
                Name: 'ServiceName',
                Value: 'CreateTodoAPI'
              }
            ],
            Unit: 'Count',
            Value: isEmpty(newItem) ? 0 : 1
          }
        ],
        Namespace: 'Capstone/Serveless'
      })
      .promise()

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        newItem
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
