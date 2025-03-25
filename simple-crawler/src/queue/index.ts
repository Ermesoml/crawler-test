import * as fastq from "fastq";
import type { queueAsPromised, asyncWorker } from "fastq";

export class MemoryQueue<T> {
    private queue: queueAsPromised<T>;

    constructor (private concurrency: number, private worker: asyncWorker<unknown, T, any>) {
        this.queue = fastq.promise(this.worker, this.concurrency);
    }

    async push(task: T) {
        return this.queue.push(task)
    }
}