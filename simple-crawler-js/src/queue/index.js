import * as fastq from "fastq";

export class MemoryQueue {
    queue;

    constructor (concurrency, worker) {
        this.queue = fastq.promise(worker, concurrency);
    }

    async push(task) {
        return this.queue.push(task)
    }
}
