import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as path from 'path';

export class AwsSamCliCdkHelloWorldStack extends cdk.Stack {
  public readonly s3bucket: s3.IBucket;
  public readonly role: iam.Role;
  public readonly lambda: lambda.Function;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Target S3 bucket
    this.s3bucket = new s3.Bucket(this, 'hello-world-bucket', {
      bucketName: 'YOUR-TARGET-S3-BUCKET'
    });

    // The IAM Role of execution
    this.role = this.buildLambdaIAMRole();

    // The code that defines your stack goes here
    this.lambda = new lambda.Function(this, 'hello-world-lambda-function', {
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'app.lambda_handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '..', 'hello_world')),
      role: this.role,
    });

  }

  private buildLambdaIAMRole() {
    let role = new iam.Role(this, 'hello-world-role', {
      assumedBy: new iam.ServicePrincipal('batchoperations.s3.amazonaws.com'),
    });
    this.role.addToPolicy(new iam.PolicyStatement({
      resources: [
        "*"
      ],
      actions: [
        "lambda:InvokeFunction"
      ],
    }));
    this.role.addToPolicy(new iam.PolicyStatement({
      resources: [
        `${this.s3bucket.bucketArn}`,
        `${this.s3bucket.bucketArn}/*`
      ],
      actions: [
        "s3:GetObject",
        "s3:ListBucket",
        "s3:GetBucketLocation",
        "s3:GetObjectVersion",
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetLifecycleConfiguration",
        "s3:PutLifecycleConfiguration",
        "s3:DeleteObject",
      ],
    }));
    this.role.addToPolicy(new iam.PolicyStatement({
      resources: [
        "*",
      ],
      actions: [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
      ]
    }));
    return role;
  }
}
