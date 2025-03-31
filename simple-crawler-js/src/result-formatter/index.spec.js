const { ResultFormatter } = require("./index.js");
const { TxtFileWriter } = require("../file-writer");

jest.mock('../file-writer');

describe('ResultFormatter', () => {
  let resultFormatter;
  const mockTxtFileWriter = {
    appendToFile: jest.fn(),
  };
  TxtFileWriter.mockImplementation(() => mockTxtFileWriter);

  beforeEach(() => {
    resultFormatter = new ResultFormatter('test.txt');
    mockTxtFileWriter.appendToFile.mockClear();
  });

  it('should create a ResultFormatter instance', () => {
    expect(TxtFileWriter).toHaveBeenCalledWith('test.txt');
  });

  it('should create a file with result', () => {
    const urlAnalisisResults = [
      { domain: 'domain1', path: '/', status: 200 },
      { domain: 'domain1', path: '/login', status: 404 },
      { domain: 'domain2', path: '/', status: 200 },
    ];

    resultFormatter.createFileWithResult(urlAnalisisResults);

    expect(mockTxtFileWriter.appendToFile).toHaveBeenCalledTimes(2);
    expect(mockTxtFileWriter.appendToFile).toHaveBeenCalledWith(expect.stringContaining('Results for domain1:'));
    expect(mockTxtFileWriter.appendToFile).toHaveBeenCalledWith(expect.stringContaining('Results summary:'));
  });
});
