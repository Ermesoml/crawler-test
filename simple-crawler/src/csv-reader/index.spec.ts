import { CsvParser } from "./index";
import * as fs from 'fs';

jest.mock('fs');

describe('CsvParser', () => {
  let csvParser: CsvParser<any>;
  const mockFs = fs as jest.Mocked<typeof fs>;

  beforeEach(() => {
    csvParser = new CsvParser();
    mockFs.readFileSync.mockClear();
  });

  it('should read file and parse CSV content', async () => {
    const filePath = 'test.csv';
    const fileContent = 'header1;header2\nvalue1;value2';
    mockFs.readFileSync.mockReturnValue(fileContent);

    const result = await csvParser.parseCsv(filePath);

    expect(mockFs.readFileSync).toHaveBeenCalledWith(filePath, { encoding: 'utf-8' });
    expect(result).toEqual(expect.any(Array));
    expect(result[0]).toEqual(expect.any(Object));
    expect((result[0] as any).header1).toEqual('value1');
    expect((result[0] as any).header2).toEqual('value2');
  });

  it('should reject with an error if reading file fails', async () => {
    const filePath = 'test.csv';
    const error = new Error('File read error');
    mockFs.readFileSync.mockImplementation(() => {
      throw error;
    });

    await expect(csvParser.parseCsv(filePath)).rejects.toThrow(error);
    expect(mockFs.readFileSync).toHaveBeenCalledWith(filePath, { encoding: 'utf-8' });
  });

  it('should reject with an error if parsing fails', async () => {
    const filePath = 'test.csv';
    const fileContent = 'invalid-csv-data'; // No delimiter, invalid CSV
    mockFs.readFileSync.mockReturnValue(fileContent);

    await expect(csvParser.parseCsv(filePath)).rejects.toThrow('Invalid CSV format');
    expect(mockFs.readFileSync).toHaveBeenCalledWith(filePath, { encoding: 'utf-8' });
  });
});
