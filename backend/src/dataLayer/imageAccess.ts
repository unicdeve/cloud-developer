import * as AWS from 'aws-sdk'
import { createLogger } from '../utils/logger'

import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('fileAccess')

export class ImageAccess {
  constructor(
    private readonly s3: AWS.S3 = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
    private readonly presignedUrlExpiration: number = parseInt(
      process.env.PRESIGNED_URL_EXPIRATION
    )
  ) {}

  async getUploadUrl(todoId: string): Promise<string> {
    const uploadUrl = this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: todoId,
      Expires: this.presignedUrlExpiration
    })

    logger.info('upload-url', { uploadUrl })

    return uploadUrl
  }
}
