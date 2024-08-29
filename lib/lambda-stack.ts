import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3Notify from 'aws-cdk-lib/aws-s3-notifications';
import { S3Stack } from './s3-stack';

export class LambdaStack extends Stack {
  constructor(scope: cdk.App, id: string, s3Stack: S3Stack, props?: StackProps) {
    super(scope, id, props);

    // Amazon Textract用Lambda関数
    const textractHandler = new lambda.Function(this, 'textractHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'textract-handler.handler',
      code: lambda.Code.fromAsset('src'),
      environment: {
        PROCESSED_DATA_BUCKET: s3Stack.processedDataBucket.bucketName,
      },
    });

    // Bedrock用
    const bedrockHandler = new lambda.Function(this, 'bedrockHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'bedrock-handler.handler',
      code: lambda.Code.fromAsset('src'),
      environment: {
        PROCESSED_DATA_BUCKET: s3Stack.ragDataBucket.bucketName,
      },
    });

    // S3通知設定
    s3Stack.originalDataBucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3Notify.LambdaDestination(textractHandler))
    s3Stack.processedDataBucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3Notify.LambdaDestination(bedrockHandler))

    // Lambdaにｓ3へのアクセス権を付与
    s3Stack.processedDataBucket.grantReadWrite(textractHandler);
    s3Stack.ragDataBucket.grantReadWrite(bedrockHandler);
  }
}