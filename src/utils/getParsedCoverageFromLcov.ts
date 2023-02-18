import { LcovFile, source } from 'lcov-parse';
import { createParsedCoverage } from './createParsedCoverage';
import { normalizePath } from './normalizePath';

const getPercents = (found: number, hit: number) => {
	if (found === 0) {
		return 100;
	}

	return (hit / found) * 100;
};

export const getParsedCoverageFromLcov = async (content: string) => {
	const lcovFiles = await new Promise<LcovFile[]>((resolve, reject) =>
		source(content, (error, data) => {
			if (!data) {
				reject(error);
			} else {
				resolve(data);
			}
		}),
	);

	const coverageMap = new Map<string, LcovFile>();
	for (const file of lcovFiles) {
		coverageMap.set(normalizePath(file.file), file);
	}

	type InternalSummaryStat = {
		found: number;
		hit: number;
	};

	type InternalSummary = Record<'lines' | 'branches' | 'functions', InternalSummaryStat>;

	return createParsedCoverage<InternalSummary>(
		{
			getFiles: () => [...coverageMap.keys()],
			getSummaryFor: (filename) => {
				const file = coverageMap.get(filename);
				if (!file) {
					throw new Error('Something went wrong...');
				}

				return {
					lines: {
						found: file.lines.found,
						hit: file.lines.hit,
					},
					branches: {
						found: file.branches.found,
						hit: file.branches.hit,
					},
					functions: {
						found: file.functions.found,
						hit: file.functions.hit,
					},
				};
			},
			createEmptySummary: () => ({
				lines: {
					found: 0,
					hit: 0,
				},
				branches: {
					found: 0,
					hit: 0,
				},
				functions: {
					found: 0,
					hit: 0,
				},
			}),
			getStats: (coverage) =>
				(['lines', 'branches', 'functions'] as const).map((key) =>
					getPercents(coverage[key].found, coverage[key].hit),
				),
			mergeSummaries: (a, b) => {
				return Object.fromEntries(
					(['lines', 'branches', 'functions'] as const).map((key) => {
						return [
							key,
							{
								found: a[key].found + b[key].found,
								hit: a[key].found + b[key].hit,
							},
						];
					}),
				) as InternalSummary;
			},
		},
		['Lines', 'Branches', 'Functions'],
	);
};
