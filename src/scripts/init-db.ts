import fs from 'node:fs/promises';
import path from 'node:path';
import { pipeline } from '@huggingface/transformers';
import { Pool } from 'pg';
import pgvector from 'pgvector/pg';

type Document = {
  fileName: string;
  filePath: string;
  content: string;
  source: 'internal_wiki' | 'customer_ticket';
};

type Chunk = Document & {
  chunkIdx: number;
};

type EmbeddedChunk = Chunk & {
  embedding: number[];
};

type ChunkToEmbed = Omit<Chunk, 'embedding'>;

const pool = new Pool({
  user: 'postgres',
  host: 'postgres',
  database: 'vectordb',
  password: 'postgrespass',
  port: 5432,
});

async function initDB() {
  // load

  const files = await loadDocuments('./data');

  // split

  const chunks = splitDocuments(files, 1500);

  // embed

  const embeddedChunks = await createEmbeddings(chunks);

  // store

  await storeEmbeddings(embeddedChunks);

  return embeddedChunks;
}

async function loadDocuments(dirPath: string): Promise<Document[]> {
  try {
    const entries = await fs.readdir(dirPath, {
      withFileTypes: true,
      recursive: true,
    });

    const files = entries.filter((e) => e.isFile());

    const documents = await Promise.all(
      files.map(async (entry) => {
        const fullPath = path.join(entry.parentPath, entry.name);

        const content = await fs.readFile(fullPath, 'utf-8');

        const document: Document = {
          fileName: entry.name,
          filePath: fullPath,
          content: content,
          source:
            entry.name[entry.name.length - 1] === 'tickets'
              ? 'customer_ticket'
              : 'internal_wiki',
        };

        return document;
      }),
    );

    return documents;
  } catch (e) {
    console.error(e);
    return [];
  }
}

function splitDocuments(files: Document[], charLimit: number): Chunk[] {
  const result: Chunk[] = [];

  for (const file of files) {
    if (file.content.length <= charLimit) {
      result.push({ ...file, chunkIdx: 0 });
      continue;
    }

    const sections = file.content.split(/(?=^##\s)/gm).filter(Boolean);

    sections.forEach((section, idx) => {
      result.push({ ...file, content: section.trim(), chunkIdx: idx });
    });
  }

  return result;
}

async function createEmbeddings(
  chunks: ChunkToEmbed[],
): Promise<EmbeddedChunk[]> {
  const extractor = await pipeline(
    'feature-extraction',
    'Xenova/all-MiniLM-L6-v2',
  );

  const output = await extractor(
    chunks.map((c) => c.content),
    { pooling: 'mean', normalize: true },
  );

  const embeddings = output.tolist() as number[][];

  return chunks.map((chunk, i) => ({
    ...chunk,
    embedding: embeddings[i],
  }));
}

async function storeEmbeddings(embeddedChunks: EmbeddedChunk[]) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query('TRUNCATE chunks RESTART IDENTITY');

    for (const c of embeddedChunks) {
      await client.query(
        `INSERT INTO chunks (content, file_name, file_path, source, chunk_idx, embedding) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          c.content,
          c.fileName,
          c.filePath,
          c.source,
          c.chunkIdx,
          pgvector.toSql(c.embedding),
        ],
      );
    }

    await client.query('COMMIT');

    console.log('data inserted');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

initDB()
  .then((chunks) => {
    console.log(chunks);
    console.log(`Done. Created ${chunks.length} embedded chunks.`);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
