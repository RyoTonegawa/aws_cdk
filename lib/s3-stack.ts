import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from "aws-cdk-lib";
import * as s3 from 'aws-cdk-lib/aws-s3';

export class S3Stack extends Stack {
  public readonly auditLogBucket: s3.Bucket;
  public readonly originalDataBucket: s3.Bucket;
  public readonly processedDataBucket: s3.Bucket;
  public readonly ragDataBucket: s3.Bucket;
  constructor(scope: cdk.App, id: string, props?: StackProps) {
    super(scope, id, props)

    // 監査ログ用バケット(Immutable)
    this.auditLogBucket = new s3.Bucket(this, 'auditLogDataBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
    })
    const CfnBucket = this.auditLogBucket.node.defaultChild as s3.CfnBucket;
    CfnBucket.objectLockEnabled = true;

    // 元データ用バケット
    this.originalDataBucket = new s3.Bucket(this, 'originalDataBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN
    })

    // 前処理・処理結果用バケット
    this.processedDataBucket = new s3.Bucket(this, 'processedDataBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN
    })

    // 前処理・処理結果用バケット
    this.ragDataBucket = new s3.Bucket(this, 'ragDataBucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN
    })

  }
}