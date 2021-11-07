import * as AWS from 'aws-sdk'
import { createLogger } from '../utils/logger'

const logger = createLogger('fileAccess')

export class ImageAccess {
  constructor(
    private readonly s3: AWS.S3 = new AWS.S3({ signatureVersion: 'v4' }),
    private readonly bucketName = process.env.IMAGES_S3_BUCKET,
    private readonly presignedUrlExpiration: Number = parseInt(
      process.env.PRESIGNED_URL_EXPIRATION
    )
  ) {}

  async getUploadUrl(imageId: string): Promise<string> {
    const uploadUrl = this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: imageId,
      Expires: this.presignedUrlExpiration
    })

    logger.info('upload-url', { uploadUrl })

    return uploadUrl
  }
}
