export type ParsedCoverageChild = {
	path: string;
	children: ParsedCoverageChild[];
	summaryStats: number[];
	type: 'file' | 'directory';
};

export type ParsedCoverage = {
	children: ParsedCoverageChild[];
	summaryStats: number[];
	summaryTitles: string[];
};
