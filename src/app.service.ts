import { BadRequestException, Injectable } from '@nestjs/common';
import { getExtractor } from './extractor';
import { pool } from './db';
import pgvector from 'pgvector/pg';

type RetrievedChunk = {
  id: number;
  content: string;
  source: 'internal_wiki' | 'customer_ticket';
  filePath: string;
};

@Injectable()
export class AppService {
  async askQuestion(question: string) {
    if (!question) {
      throw new BadRequestException('Question is required');
    }

    const extractor = await getExtractor();

    const output = await extractor(question, {
      pooling: 'mean',
      normalize: true,
    });

    const embeddedQuestion = Array.from(output.data as Float32Array);

    const { rows } = await pool.query<RetrievedChunk>(
      `SELECT id, content, file_path, source
       FROM chunks
       ORDER BY embedding <=> $1
       LIMIT 4`,
      [pgvector.toSql(embeddedQuestion)],
    );

    return rows;
  }
}
