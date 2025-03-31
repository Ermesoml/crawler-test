import * as fs from 'fs';
import * as path from 'path';

export class TxtFileWriter {
  filePath;

  constructor(filePath) {
    this.filePath = filePath;
    this.ensureDirectoryExistence(filePath);
  }

  ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
      return;
    }
    fs.mkdirSync(dirname, { recursive: true });
  }


  appendToFile(text) {
    fs.appendFileSync(this.filePath, text + '\n');
  }
}
