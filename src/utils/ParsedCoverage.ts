import { CoverageSummary } from 'istanbul-lib-coverage';

export type ParsedCoverage = {
	path: string;
	children: ParsedCoverage[];
	summary: CoverageSummary;
	type: 'file' | 'directory';
};
