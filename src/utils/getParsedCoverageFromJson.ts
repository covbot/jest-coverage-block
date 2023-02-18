import { createCoverageMap, createCoverageSummary } from 'istanbul-lib-coverage';
import { createParsedCoverage } from './createParsedCoverage';
import { normalizePath } from './normalizePath';
import { ParsedCoverage } from './ParsedCoverage';

export const getParsedCoverageFromJson = (jsonContent: string): ParsedCoverage => {
	const value = JSON.parse(jsonContent);

	const coverageMapData = 'coverageMap' in value ? value.coverageMap : value;
	const coverageMapDataEntries = Object.entries(coverageMapData).map(([key, value]) => [normalizePath(key), value]);
	const coverageMap = createCoverageMap(Object.fromEntries(coverageMapDataEntries));

	return createParsedCoverage(
		{
			createEmptySummary: createCoverageSummary,
			getFiles: coverageMap.files.bind(coverageMap),
			getSummaryFor: (filename) => coverageMap.fileCoverageFor(filename).toSummary(),
			getStats: (summary) => [
				summary.lines.pct,
				summary.statements.pct,
				summary.branches.pct,
				summary.functions.pct,
			],
			mergeSummaries: (a, b) => a.merge(b),
		},
		['Lines', 'Statements', 'Branches', 'Functions'],
	);
};
