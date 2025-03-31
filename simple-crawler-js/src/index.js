import { CsvParser } from "./csv-reader/index.js";
import { ResultFormatter } from "./result-formatter/index.js";
import { UrlsAnalyser } from "./urls-analyser/index.js";

async function start() {
    const csvReader = new CsvParser();

    const domainsCsv = await csvReader.parseCsv('../entry-data/domains.csv');
    const pathsCsv = await csvReader.parseCsv('../entry-data/paths.csv');

    const analyser = new UrlsAnalyser();
    const result = await analyser.analyseDomainAndPaths(domainsCsv.map(d => d.domain), pathsCsv.map(p => p.path));

    const process = new ResultFormatter('../results/result.txt');
    process.createFileWithResult(result);
}

start();
