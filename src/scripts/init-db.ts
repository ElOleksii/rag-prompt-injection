import fs from 'node:fs/promises';
import path from 'node:path';
import OpenAI from 'openai';

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

async function initDB() {
  // load

  const files = await loadDocuments('./data');

  // split

  const chunks = splitDocuments(files, 1500);

  // embed

  const embeddedChunks = await createEmbeddings(chunks);

  return embeddedChunks;

  // store
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

const client = new OpenAI();

async function createEmbeddings(chunks: ChunkToEmbed[]): Promise<Chunk[]> {
  const res = await client.embeddings.create({
    model: 'text-embedding-3-small',
    input: chunks.map((c) => c.content),
  });

  console.log(res);

  return chunks.map((chunk, i) => ({
    ...chunk,
    embedding: res.data[i].embedding,
  }));
}
