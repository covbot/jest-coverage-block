import { createCoverageMap, createCoverageSummary } from 'istanbul-lib-coverage';
import { ParsedCoverage } from './ParsedCoverage';

const dirname = (value: string) => {
	if (value.length === 0) {
		return '.';
	}

	const lastSlashIndex = value.lastIndexOf('/', value.length - 1);
	if (lastSlashIndex === -1) {
		return '.';
	}

	return value.slice(0, Math.max(0, lastSlashIndex));
};

/**
 * Find a common path from a list of filepaths.
 */
export const findCommonPath = (filepaths: string[]): string => {
	let commonRoot = '';
	if (filepaths.length > 0) {
		// If the paths are sorted, any prefix common to all paths will be common to the sorted first and last strings.
		const sortedPaths = [...filepaths].sort();
		const first = sortedPaths[0];
		const last = sortedPaths[sortedPaths.length - 1];

		const length = Math.min(first.length, last.length);
		for (let index = 0; index < length; index++) {
			const ch1 = first[index];
			const ch2 = last[index];
			if (ch1 == ch2) {
				commonRoot += ch1;
			} else {
				break;
			}
		}

		// If it doesn't appear to be a directory (partial filename), get the parent directory
		if (commonRoot.length > 0 && commonRoot[commonRoot.length - 1] !== '/') {
			commonRoot = dirname(commonRoot) + '/';
		}
	}
	return commonRoot;
};

const normalizePath = (value: string) => value.replace(/\\/g, '/');

export const getParsedCoverageFromJson = (jsonContent: string): ParsedCoverage => {
	const value = JSON.parse(jsonContent);

	const coverageMapData = 'coverageMap' in value ? value.coverageMap : value;
	const coverageMapDataEntries = Object.entries(coverageMapData).map(([key, value]) => [normalizePath(key), value]);
	const coverageMap = createCoverageMap(Object.fromEntries(coverageMapDataEntries));
	const rootDirectory = findCommonPath(coverageMap.files());

	type InternalParsedCoverage = Omit<ParsedCoverage, 'children'> & {
		children: Map<string, InternalParsedCoverage>;
	};

	const rootCoverage: InternalParsedCoverage = {
		children: new Map(),
		path: rootDirectory,
		summary: createCoverageSummary(),
		type: 'directory',
	};

	for (const file of coverageMap.files()) {
		const normalizedFile = file.slice(rootDirectory.length);
		const path = normalizedFile.split('/');
		const summary = coverageMap.fileCoverageFor(file).toSummary();
		let segment: string | undefined;
		let currentNode: InternalParsedCoverage = rootCoverage;
		rootCoverage.summary = rootCoverage.summary.merge(summary);
		while ((segment = path.shift()) !== undefined) {
			if (!currentNode.children.has(segment)) {
				currentNode.children.set(segment, {
					path: segment,
					summary: createCoverageSummary(),
					children: new Map(),
					type: 'directory',
				});
			}

			currentNode = currentNode.children.get(segment)!;
			currentNode.summary = currentNode.summary.merge(summary);
		}
		currentNode.type = 'file';
	}

	const queue: InternalParsedCoverage[] = [rootCoverage];

	let item: InternalParsedCoverage | undefined;
	while ((item = queue.shift()) !== undefined) {
		(item as unknown as ParsedCoverage).children = [...item.children.values()] as unknown as ParsedCoverage[];
		(item as unknown as ParsedCoverage).children.sort((a, b) => {
			if (a.type !== b.type) {
				return a.type === 'file' ? 1 : -1;
			}

			return a.path.localeCompare(b.path);
		});
		queue.push(...item.children.values());
	}

	return rootCoverage as unknown as ParsedCoverage;
};
