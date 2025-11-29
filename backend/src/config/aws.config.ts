import { S3Client } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { SESClient } from '@aws-sdk/client-ses';
import { TextractClient } from '@aws-sdk/client-textract';
import { SFNClient } from '@aws-sdk/client-sfn';
import env from './env';

const awsConfig = {
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
};

// S3 Client for document storage
export const s3Client = new S3Client(awsConfig);

// DynamoDB Client for verification results cache
const dynamoClient = new DynamoDBClient(awsConfig);
export const docClient = DynamoDBDocumentClient.from(dynamoClient, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
});

// SES Client for email notifications
export const sesClient = new SESClient(awsConfig);

// Textract Client for document processing
export const textractClient = new TextractClient(awsConfig);

// Step Functions Client for workflow orchestration
export const sfnClient = new SFNClient(awsConfig);

// S3 Bucket configuration
export const S3_BUCKET = env.AWS_S3_BUCKET;
export const DYNAMODB_TABLE = env.AWS_DYNAMODB_TABLE;

// S3 folder structure
export const S3_FOLDERS = {
  RESUMES: 'resumes',
  DOCUMENTS: 'documents',
  REPORTS: 'reports',
  TEMP: 'temp',
} as const;
