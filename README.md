# aws-lambda-sam-cdk-template

AWS Serverless Application Model (SAM) `sam init` command provids template project of basic lambda function. However, lambda usecases are not only API gateway backends but also other AWS services.
This repository provides templates for Lambda projects beyond the basic usage.

## Supported AWS Services

- [Amazon S3 Batch Operations](https://aws.amazon.com/s3/features/batch-operations/)
    - CDK Runtime: Typescript
    - Lambda Runtime: Python3.8

## How to use

```console
$ sam init --location gh:siroken3/aws-lambda-sam-cdk-template/s3-batch-operations/python3.8
```
