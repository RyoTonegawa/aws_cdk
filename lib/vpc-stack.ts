import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
export class VpcStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const PRIVATE_SUBNET1 = 'PrivateSubnet1'
    const PUBLIC_SUBNET1 = 'PublicSubnet1'
    // VPC
    const vpc = new ec2.Vpc(this, 'Vpc1', {
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: PUBLIC_SUBNET1,
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: PRIVATE_SUBNET1,
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS
        }
      ]
    });

    const privateSrcurityGroup = new ec2.SecurityGroup(this, `${PRIVATE_SUBNET1}SecurityGroup`, {
      vpc: this.vpc,
      allowAllOutbound: true,
      description: 'アウトバウンドフルオープン'
    })

    privateSrcurityGroup.addIngressRule(
      ec2.Peer.ipv4('126.169.101.168'),
      ec2.Port.tcp(443),
      '自身のPCのみインバウンドトラフィック許可'
    )
  }
}
