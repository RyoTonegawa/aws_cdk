import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class CloudWatchStack extends Stack {
  constructor(scope: cdk.App, id: string, props?: StackProps) {
    super(scope, id, props);

    // CloudWatch Logsグループの作成
    const logGroup = new logs.LogGroup(this, 'ProductionLogGroup', {
      retention: logs.RetentionDays.ONE_YEAR, // ログ保持期間を1年に設定
    });

    // 例: Lambda関数にロググループを指定
    const exampleLambdaFunction = new lambda.Function(this, 'ExampleFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'example.handler',
      code: lambda.Code.fromAsset('src'),
      logRetention: logs.RetentionDays.ONE_YEAR, // Lambda関数のログ保持期間も設定
      environment: {
        LOG_GROUP_NAME: logGroup.logGroupName,
      },
    });

  }
}
