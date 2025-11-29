import {
  TextractClient,
  DetectDocumentTextCommand,
  AnalyzeDocumentCommand,
} from '@aws-sdk/client-textract';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { textractClient, s3Client, S3_BUCKET } from '../config/aws.config';
import { logger } from '../utils/logger';
import { ExternalServiceError } from '../utils/errorHandler';

export interface ExtractedText {
  fullText: string;
  lines: string[];
  confidence: number;
}

export class TextractService {
  async extractTextFromS3(s3Key: string): Promise<ExtractedText> {
    try {
      logger.info(`Extracting text from S3 object: ${s3Key}`);

      // Get the document from S3
      const getObjectCommand = new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: s3Key,
      });

      const s3Object = await s3Client.send(getObjectCommand);

      if (!s3Object.Body) {
        throw new Error('S3 object body is empty');
      }

      // Convert stream to buffer
      const bytes = await s3Object.Body.transformToByteArray();

      // Use Textract to extract text
      const textractCommand = new DetectDocumentTextCommand({
        Document: {
          Bytes: bytes,
        },
      });

      const response = await textractClient.send(textractCommand);

      // Process the response
      const lines: string[] = [];
      let fullText = '';
      let totalConfidence = 0;
      let confidenceCount = 0;

      if (response.Blocks) {
        for (const block of response.Blocks) {
          if (block.BlockType === 'LINE' && block.Text) {
            lines.push(block.Text);
            fullText += block.Text + '\n';
          }
          if (block.Confidence) {
            totalConfidence += block.Confidence;
            confidenceCount++;
          }
        }
      }

      const averageConfidence = confidenceCount > 0 ? totalConfidence / confidenceCount : 0;

      logger.info(`Text extraction completed. Confidence: ${averageConfidence.toFixed(2)}%`);

      return {
        fullText: fullText.trim(),
        lines,
        confidence: averageConfidence,
      };
    } catch (error) {
      logger.error('Failed to extract text with Textract:', error);
      throw new ExternalServiceError(
        'Failed to extract text from document',
        'AWS Textract'
      );
    }
  }

  async analyzeDocument(s3Key: string): Promise<{
    extractedText: ExtractedText;
    keyValuePairs: Record<string, string>;
    tables: any[];
  }> {
    try {
      logger.info(`Analyzing document from S3: ${s3Key}`);

      // Get the document from S3
      const getObjectCommand = new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: s3Key,
      });

      const s3Object = await s3Client.send(getObjectCommand);

      if (!s3Object.Body) {
        throw new Error('S3 object body is empty');
      }

      const bytes = await s3Object.Body.transformToByteArray();

      // Use Textract to analyze document
      const analyzeCommand = new AnalyzeDocumentCommand({
        Document: {
          Bytes: bytes,
        },
        FeatureTypes: ['FORMS', 'TABLES'],
      });

      const response = await textractClient.send(analyzeCommand);

      // Extract text
      const lines: string[] = [];
      let fullText = '';
      let totalConfidence = 0;
      let confidenceCount = 0;

      if (response.Blocks) {
        for (const block of response.Blocks) {
          if (block.BlockType === 'LINE' && block.Text) {
            lines.push(block.Text);
            fullText += block.Text + '\n';
          }
          if (block.Confidence) {
            totalConfidence += block.Confidence;
            confidenceCount++;
          }
        }
      }

      const averageConfidence = confidenceCount > 0 ? totalConfidence / confidenceCount : 0;

      const extractedText: ExtractedText = {
        fullText: fullText.trim(),
        lines,
        confidence: averageConfidence,
      };

      // Extract key-value pairs
      const keyValuePairs: Record<string, string> = {};
      // Note: Actual implementation would parse FORMS from Textract response

      // Extract tables
      const tables: any[] = [];
      // Note: Actual implementation would parse TABLES from Textract response

      logger.info('Document analysis completed');

      return {
        extractedText,
        keyValuePairs,
        tables,
      };
    } catch (error) {
      logger.error('Failed to analyze document with Textract:', error);
      throw new ExternalServiceError(
        'Failed to analyze document',
        'AWS Textract'
      );
    }
  }
}

export const textractService = new TextractService();
