import { getParsedCoverageFromJson } from './getParsedCoverageFromJson';
import { getParsedCoverageFromLcov } from './getParsedCoverageFromLcov';

export const getParsedCoverage = (content: string, filePath: string) => {
	const dotIndex = Math.max(filePath.lastIndexOf('.'), 0);
	const extension = filePath.slice(dotIndex).toLowerCase();
	const fileName = filePath.slice(filePath.lastIndexOf('/'), dotIndex).toLowerCase();
	if (extension === '.json') {
		return getParsedCoverageFromJson(content);
	}

	if (extension === '.info' || fileName === 'lcov') {
		return getParsedCoverageFromLcov(content);
	}
};
