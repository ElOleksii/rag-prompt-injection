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

    // split

    return this.splitDocuments(files, 1000);

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
  private splitDocuments(files: Document[], charLimit: number): Document[] {
    const result: Document[] = [];

    for (const file of files) {
      if (file.content.length <= charLimit) {
        result.push(file);
        continue;
      }

      const sections = file.content.split(/(?=^##\s)/gm).filter(Boolean);

      for (const section of sections) {
        result.push({
          ...file,
          content: section.trim(),
        });
      }
    }

    return result;
  }
}
