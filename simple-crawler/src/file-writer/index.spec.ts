import * as fs from 'fs';
import * as path from 'path';
import { TxtFileWriter } from './index';

// Mock the fs module
jest.mock('fs');

describe('TxtFileWriter', () => {
  const mockFs = fs as jest.Mocked<typeof fs>;
  const filePath = 'test/path/file.txt';
  const dirPath = 'test/path';

  beforeEach(() => {
    mockFs.existsSync.mockClear();
    mockFs.mkdirSync.mockClear();
    mockFs.appendFileSync.mockClear();
  });

  it('should create a TxtFileWriter instance', () => {
    const writer = new TxtFileWriter(filePath);
    expect(writer).toBeInstanceOf(TxtFileWriter);
  });

  describe('ensureDirectoryExistence', () => {
    it('should create directory if it does not exist', () => {
      mockFs.existsSync.mockReturnValue(false);
      new TxtFileWriter(filePath);
      expect(mockFs.mkdirSync).toHaveBeenCalledWith(dirPath, { recursive: true });
    });

    it('should not create directory if it exists', () => {
      mockFs.existsSync.mockReturnValue(true);
      new TxtFileWriter(filePath);
      expect(mockFs.mkdirSync).not.toHaveBeenCalled();
    });
  });

  describe('appendToFile', () => {
    it('should append text to file with a newline', () => {
      const writer = new TxtFileWriter(filePath);
      const text = 'test text';
      writer.appendToFile(text);
      expect(mockFs.appendFileSync).toHaveBeenCalledWith(filePath, text + '\n');
    });

    it('should handle empty text', () => {
      const writer = new TxtFileWriter(filePath);
      writer.appendToFile('');
      expect(mockFs.appendFileSync).toHaveBeenCalledWith(filePath, '\n');
    });
  });
});
