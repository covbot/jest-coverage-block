import { getParsedCoverageFromJson } from './getParsedCoverageFromJson';

export const getParsedCoverage = (content: string, filePath: string) => {
	const extension = filePath.substring(filePath.lastIndexOf('.')).toLowerCase();
	if (extension === '.json') {
		return getParsedCoverageFromJson(content);
	}
};
