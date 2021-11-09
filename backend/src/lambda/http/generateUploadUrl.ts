import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import 'source-map-support/register'
import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
import { isEmpty } from '../../utils/isEmpty'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('generateUploadUrl')

const cloudwatch = new AWS.CloudWatch()

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    logger.info('userId: ', { userId: userId })

    const url = await createAttachmentPresignedUrl(todoId, userId)
    logger.info('upload url', { url })

    // do not await this, not to keep the user waiting
    cloudwatch.putMetricData({
      MetricData: [
        {
          MetricName: 'Success',
          Dimensions: [
            {
              Name: 'ServiceName',
              Value: 'GenerateUploadUrlAPI'
            }
          ],
          Unit: 'Count',
          Value: isEmpty(url) ? 0 : 1
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
        uploadUrl: url
      })
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
