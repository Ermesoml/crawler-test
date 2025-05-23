const { TxtFileWriter } = require("../file-writer/index.js");
class ResultFormatter {
    constructor(filePath) {
        this.fileWriter = new TxtFileWriter(filePath);
    }

    createFileWithResult(urlAnalisisResults) {
        const domainsResults = new Map();

        const globalStats = {
            domainsTested: new Set(),
            pathsTestedCount: 0
        }

        for (let i = 0; i < urlAnalisisResults.length; i++) {
            const result = urlAnalisisResults[i];

            globalStats.domainsTested.add(result.domain)
            globalStats.pathsTestedCount += 1;

            const currentResult = domainsResults.get(result.domain)
            const statusCount = (currentResult?.pathStatus[result.status] ?? 0) + 1;
            const validPaths = [...(currentResult?.validPaths ?? [])];

            if (result.status === 200) validPaths.push(result.path)

            const newResult = {
                validPaths,
                pathStatus: {
                    ...(currentResult?.pathStatus ?? {}),
                    ...{ [result.status]: statusCount }
                }
            }

            domainsResults.set(result.domain, newResult);
        }

        let textResult = []
        for (const [key, value] of domainsResults.entries()) {
            textResult.push(...this.getDomainReportText(key, value));
        }

        const globalStatsReport = this.getGlobalStatsReportText(globalStats).join('\n');
        const domainReports = textResult.join('\n');

        this.fileWriter.appendToFile(domainReports);
        this.fileWriter.appendToFile(globalStatsReport);
    }

    getDomainReportText(domain, domainResult) {
        let domainText = [];
        domainText.push(`Results for ${domain}:`)

        domainText.push(`  Status codes:`)
        Object.entries(domainResult.pathStatus).map(([key, value]) => domainText.push(`    ${key}: ${value}`))

        domainText.push(`  Valid paths:`)
        domainResult.validPaths.map(path => domainText.push(`    ${domain}${path}`))

        domainText.push('----')
        domainText.push('')

        return domainText;
    }

    getGlobalStatsReportText(globalStats) {
        let domainText = [];
        domainText.push(`Results summary:`)
        domainText.push(`  Total domains tested: ${globalStats.domainsTested.size}`)
        domainText.push(`  Total paths tested: ${globalStats.pathsTestedCount}`)
        return domainText;
    }
}
module.exports = { ResultFormatter };
