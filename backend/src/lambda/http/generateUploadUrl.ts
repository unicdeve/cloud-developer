import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import 'source-map-support/register'
import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
import { getUserId, timeInMs } from '../utils'

const logger = createLogger('generateUploadUrl')

const cloudwatch = new AWS.CloudWatch()

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const startTime = timeInMs()
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    logger.info('userId: ', { userId: userId })

    try {
      const url = await createAttachmentPresignedUrl(todoId, userId)
      logger.info('upload url', { url })

      return {
        statusCode: 200,
        body: JSON.stringify({
          uploadUrl: url
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
                Value: 'GenerateUploadUrlAPI'
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
