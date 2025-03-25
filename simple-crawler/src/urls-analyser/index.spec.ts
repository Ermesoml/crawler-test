// simple-crawler/src/urls-analyser/index.test.ts
import { UrlsAnalyser } from ".";
import { MemoryQueue } from "../queue";
import { UrlProperties } from "../type/analyser.type";

jest.mock("../queue");

const fetchMock = jest.spyOn(global, "fetch" as any) as jest.Mock;

describe("UrlsAnalyser", () => {
  let analyser: UrlsAnalyser;
  let queuePushMock: jest.Mock;

  beforeEach(() => {
    queuePushMock = jest.fn();
    (MemoryQueue as jest.Mock).mockImplementation(() => ({
      push: queuePushMock,
    }));
    analyser = new UrlsAnalyser();
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it("should initialize correctly", () => {
    expect(MemoryQueue).toHaveBeenCalledWith(4, expect.any(Function));
  });

  it("should check URL and return status", async () => {
    const urlProperties: UrlProperties = { domain: "example.com", path: "/test" };
    const mockResponse = { status: 200 };
    fetchMock.mockResolvedValue(mockResponse);

    const result = await (analyser as any).urlCheckerTask(urlProperties);

    expect(fetchMock).toHaveBeenCalledWith("example.com/test");
    expect(result).toEqual({ domain: "example.com", path: "/test", status: 200 });
  });

  it("should handle fetch errors and return -1 status", async () => {
    const urlProperties: UrlProperties = { domain: "example.com", path: "/test" };
    const error = new Error("Fetch error");
    fetchMock.mockRejectedValue(error);

    const result = await (analyser as any).urlCheckerTask(urlProperties);

    expect(fetchMock).toHaveBeenCalledWith("example.com/test");
    expect(result).toEqual({ domain: "example.com", path: "/test", status: -1 });
  });

  it("should analyze domains and paths", async () => {
    const domains = ["example.com", "test.com"];
    const paths = ["/path1", "/path2"];
    const mockResponses = [
      { status: 200 },
      { status: 404 },
      { status: 500 },
      { status: 200 },
    ]
    fetchMock.mockResolvedValueOnce(mockResponses[0])
    fetchMock.mockResolvedValueOnce(mockResponses[1])
    fetchMock.mockResolvedValueOnce(mockResponses[2])
    fetchMock.mockResolvedValueOnce(mockResponses[3])

    queuePushMock.mockImplementation(async (urlProperties: UrlProperties) => {
      return (analyser as any).urlCheckerTask(urlProperties)
    });

    const result = await analyser.analyseDomainAndPaths(domains, paths);

    expect(queuePushMock).toHaveBeenCalledTimes(domains.length * paths.length);
    expect(result).toEqual([
      { domain: "example.com", path: "/path1", status: 200 },
      { domain: "example.com", path: "/path2", status: 404 },
      { domain: "test.com", path: "/path1", status: 500 },
      { domain: "test.com", path: "/path2", status: 200 },
    ]);
  });


  it("should handle empty domains or paths", async () => {
    const result1 = await analyser.analyseDomainAndPaths([], []);
    expect(result1).toEqual([]);

    const domains = ["example.com", "test.com"];
    const result2 = await analyser.analyseDomainAndPaths(domains, []);
    expect(result2).toEqual([]);

    const paths = ["/path1", "/path2"];
    const result3 = await analyser.analyseDomainAndPaths([], paths);
    expect(result3).toEqual([]);
  });
});
