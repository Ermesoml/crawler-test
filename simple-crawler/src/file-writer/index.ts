import * as fs from 'fs';
import * as path from 'path';

export class TxtFileWriter {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.ensureDirectoryExistence(filePath);
  }

  private ensureDirectoryExistence(filePath: string): void {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
      return;
    }
    fs.mkdirSync(dirname, { recursive: true });
  }


  public appendToFile(text: string): void {
    fs.appendFileSync(this.filePath, text + '\n');
  }
}
