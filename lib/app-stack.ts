import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import { VpcStack } from './vpc-stack';
import { S3Stack } from './s3-stack';
import { LambdaStack } from './lambda-stack';

export class AppStack extends Stack {
  constructor(scope: cdk.App, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpcStack = new VpcStack(this, 'VpcStack');
    const s3Stack = new S3Stack(this, 'S3Stack');
    new LambdaStack(this, 'LambdaStack', s3Stack)
  }
}