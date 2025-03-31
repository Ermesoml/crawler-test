const fastq = require("fastq");

class MemoryQueue {
    constructor (concurrency, worker) {
        this.queue = fastq.promise(worker, concurrency);
    }

    async push(task) {
        return this.queue.push(task)
    }
}

module.exports = { MemoryQueue };
