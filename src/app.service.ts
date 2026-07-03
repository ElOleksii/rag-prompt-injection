import { Injectable } from '@nestjs/common';
import fs from 'node:fs/promises';
import path from 'node:path';

type Document = {
  fileName: string;
  filePath: string;
  content: string;
};

@Injectable()
export class AppService {
  async askQuestion(question: string) {
    // load

    const files = await this.loadDocuments('./data');
    console.log(files[0].content.length);

    // split

    // embed
    // store
  }

  private async loadDocuments(dirPath: string): Promise<Document[]> {
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
}
