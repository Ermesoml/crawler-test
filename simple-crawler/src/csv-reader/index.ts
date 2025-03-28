import { parse } from 'csv-parse';
import * as fs from 'fs';

export class CsvParser<T> {
  async parseCsv(filePath: string): Promise<T[]> {
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });

    return new Promise((resolve, reject) => {
      parse(fileContent, {
        columns: true,
        delimiter: ';',
        skip_empty_lines: true,
      }, (err, records: T[]) => {
        if (err) {
          reject(err);
        } else if (records.length === 0 && fileContent.length > 0) {
          reject(new Error('Invalid CSV format'));
        }
         else {
          resolve(records);
        }
      });
    });
  }
}
