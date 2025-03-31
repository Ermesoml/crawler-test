const fs = require('fs');
const path = require('path');

class TxtFileWriter {
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

module.exports = { TxtFileWriter };
