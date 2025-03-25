import { MemoryQueue } from "../queue"
import { UrlAnalyserResult, UrlProperties } from "../type/analyser.type";

export class UrlsAnalyser {
    private analyserQueue: MemoryQueue<UrlProperties>;

    constructor() {
        this.analyserQueue = new MemoryQueue(4, this.urlCheckerTask.bind(this))
        console.debug("UrlsAnalyser initialized");
    }

    private async urlCheckerTask(urlProperties: UrlProperties): Promise<UrlAnalyserResult> {
        const { domain, path } = urlProperties;
        const url = `${domain}${path}`;
        console.debug(`Checking URL: ${url}`);
        try {
            const status = await this.getUrlFetchStatus(url);
            console.debug(`URL ${url} status: ${status}`);
            return {
                domain,
                path,
                status
            };
        } catch (error) {
            console.error(`Error checking URL ${url}:`, error);
            return {
                domain,
                path,
                status: -1
            };;
        }
    }

    private async getUrlFetchStatus(url: string): Promise<number> {
        try {
            const response = await fetch(url);
            console.debug(`Fetched ${url}, status: ${response.status}`);
            return response.status;
        } catch (error) {
            console.error(`Error fetching ${url}:`, error);
            return -1;
        }
    }

    public async analyseDomainAndPaths(domains: Array<string>, paths: Array<string>): Promise<Promise<any>[]> {
        const promises: Promise<any>[] = [];
        console.debug(`Starting analysis for domains: ${domains}, paths: ${paths}`);

        for (const domain of domains) {
            for (const path of paths) {
                const urlProperties: UrlProperties = {
                    domain,
                    path
                };
                console.debug(`Pushing to queue: ${JSON.stringify(urlProperties)}`);
                const promise = this.analyserQueue.push(urlProperties);
                promises.push(promise);
            }
        }

        console.debug(`All URLs enqueued. Total promises: ${promises.length}`);
        return Promise.all(promises);
    }
}