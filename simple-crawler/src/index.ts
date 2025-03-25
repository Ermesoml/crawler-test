import { CsvParser } from "./csv-reader";
import { ResultFormatter } from "./result-formatter";
import { UrlProperties } from "./type/analyser.type";
import { UrlsAnalyser } from "./urls-analyser";


async function start() {
    const csvReader: CsvParser<UrlProperties> = new CsvParser();

    const domainsCsv = await csvReader.parseCsv('../entry-data/domains.csv')
    const pathsCsv = await csvReader.parseCsv('../entry-data/paths.csv')

    const analyser: UrlsAnalyser = new UrlsAnalyser();
    const result = await analyser.analyseDomainAndPaths(domainsCsv.map(d => d.domain), pathsCsv.map(p => p.path));

    const process = new ResultFormatter('../results/result.txt');
    process.createFileWithResult(result as any)
}

start();
