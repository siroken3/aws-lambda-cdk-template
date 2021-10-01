import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';
import * as path from 'path';

export class AwsSamCliCdkHelloWorldStack extends cdk.Stack {
  public readonly role: iam.Role;
  public readonly lambda: lambda.Function;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The IAM Role of execution
    this.role = new iam.Role(this, 'hello-world-role', {
      assumedBy: new iam.ServicePrincipal('batchoperations.s3.amazonaws.com'),
    });
    this.role.addToPolicy(new iam.PolicyStatement({
      resources: ["*"],
      actions: ['lambda:InvokeFunction'],
    }))

    // The code that defines your stack goes here
    this.lambda = new lambda.Function(this, 'hello-world-lambda-function', {
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'app.lambda_handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '..', 'hello_world')),
      role: this.role,
    });

  }
}
