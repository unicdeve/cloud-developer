import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import 'source-map-support/register'
import { getTodosForUser } from '../../businessLogic/todos'
import { isEmpty } from '../../utils/isEmpty'
import { getUserId } from '../utils'

const cloudwatch = new AWS.CloudWatch()

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)
    const todos = await getTodosForUser(userId)

    // do not await this, not to keep the user waiting
    cloudwatch.putMetricData({
      MetricData: [
        {
          MetricName: 'Success',
          Dimensions: [
            {
              Name: 'ServiceName',
              Value: 'GetTodosAPIS'
            }
          ],
          Unit: 'Count',
          Value: isEmpty(todos) ? 0 : 1
        }
      ],
      Namespace: 'Capstone/Serveless'
    })

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        todos
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
