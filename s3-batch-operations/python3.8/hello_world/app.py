import logging
from urllib import parse
import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)
logger.setLevel('INFO')

s3 = boto3.client('s3')


def lambda_handler(event, context):
    """
    Sample of batch operation lambda function.
    
    :param event: The S3 batch event that contains the ID of the delete marker
                  to remove.
    :param context: Context about the event.
    :return: A result structure that Amazon S3 uses to interpret the result of the
             operation. When the result code is TemporaryFailure, S3 retries the
             operation.
    """
    # Parse job parameters from Amazon S3 batch operations
    invocation_id = event['invocationId']
    invocation_schema_version = event['invocationSchemaVersion']

    results = []
    result_code = None
    result_string = None

    task = event['tasks'][0]
    task_id = task['taskId']

    try:
        obj_key = parse.unquote(task['s3Key'], encoding='utf-8')
        obj_version_id = task['s3VersionId']
        bucket_name = task['s3BucketArn'].split(':')[-1]

        logger.info("Got task: hello world to bucket %s to object %s of version %s.",
                    bucket_name, obj_key, obj_version_id)
        result_code = 'Succeeded'
    except Exception as error:
        # Mark all other exceptions as permanent failures.
        result_code = 'PermanentFailure'
        result_string = str(error)
        logger.exception(error)
    finally:
        results.append({
            'taskId': task_id,
            'resultCode': result_code,
            'resultString': result_string
        })
    return {
        'invocationSchemaVersion': invocation_schema_version,
        'treatMissingKeysAs': 'PermanentFailure',
        'invocationId': invocation_id,
        'results': results
    }
