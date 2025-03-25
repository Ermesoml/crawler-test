// simple-crawler/src/queue/index.test.ts
import { MemoryQueue } from "./index";
import * as fastq from "fastq";

jest.mock("fastq");

describe("MemoryQueue", () => {
  const concurrency = 2;
  const worker = jest.fn(async (task: any) => task);
  let queue: MemoryQueue<any>;

  beforeEach(() => {
    (fastq.promise as jest.Mock).mockImplementation(() => ({
      push: jest.fn(),
    }));

    queue = new MemoryQueue(concurrency, worker);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be created with the correct concurrency and worker", () => {
    expect(fastq.promise).toHaveBeenCalledWith(worker, concurrency);
  });

  it("should push tasks to the queue", async () => {
    const task1 = { id: 1 };
    const task2 = { id: 2 };
    const pushMock = (queue as any).queue.push as jest.Mock;
    pushMock.mockResolvedValueOnce(task1);
    pushMock.mockResolvedValueOnce(task2);

    const result1 = await queue.push(task1);
    const result2 = await queue.push(task2);

    expect(pushMock).toHaveBeenCalledWith(task1);
    expect(pushMock).toHaveBeenCalledWith(task2);
    expect(result1).toEqual(task1);
    expect(result2).toEqual(task2);
  });

  it("should handle errors during task processing", async () => {
    const task = { id: 1 };
    const error = new Error("Test error");
    const pushMock = (queue as any).queue.push as jest.Mock;
    pushMock.mockRejectedValueOnce(error);

    await expect(queue.push(task)).rejects.toThrow(error);
    expect(pushMock).toHaveBeenCalledWith(task);
  });


  it("should process tasks concurrently", async () => {
        const tasks = Array.from({ length: 5 }, (_, i) => ({ id: i + 1 }));
        const pushMock = (queue as any).queue.push as jest.Mock;
        pushMock.mockImplementation(async (task: any) => task);

        const results = await Promise.all(tasks.map((task) => queue.push(task)));

        expect(pushMock).toHaveBeenCalledTimes(tasks.length);
        expect(results).toEqual(tasks);
    });


});
