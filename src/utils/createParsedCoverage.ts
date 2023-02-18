import { ParsedCoverage, ParsedCoverageChild } from './ParsedCoverage';

export type CoverageIterator<T> = {
	getFiles: () => string[];
	getSummaryFor: (filename: string) => T;
	mergeSummaries: (a: T, b: T) => T;
	getStats: (summary: T) => number[];
	createEmptySummary: () => T;
};

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

export const createParsedCoverage = <T>(iterator: CoverageIterator<T>, summaryTitles: string[]): ParsedCoverage => {
	const rootDirectory = findCommonPath(iterator.getFiles());

	type InternalParsedCoverage = Omit<ParsedCoverageChild, 'children' | 'summaryStats'> & {
		children: Map<string, InternalParsedCoverage>;
		summary: T;
	};

	const rootCoverage: InternalParsedCoverage = {
		children: new Map(),
		path: rootDirectory,
		summary: iterator.createEmptySummary(),
		type: 'directory',
	};

	for (const file of iterator.getFiles()) {
		const normalizedFile = file.slice(rootDirectory.length);
		const path = normalizedFile.split('/');
		const summary = iterator.getSummaryFor(file);
		let segment: string | undefined;
		let currentNode: InternalParsedCoverage = rootCoverage;
		rootCoverage.summary = iterator.mergeSummaries(rootCoverage.summary, summary);
		while ((segment = path.shift()) !== undefined) {
			if (!currentNode.children.has(segment)) {
				currentNode.children.set(segment, {
					path: segment,
					summary: iterator.createEmptySummary(),
					children: new Map(),
					type: 'directory',
				});
			}

			currentNode = currentNode.children.get(segment)!;
			currentNode.summary = iterator.mergeSummaries(currentNode.summary, summary);
		}
		currentNode.type = 'file';
	}

	type ParsedCoverageParent = Pick<ParsedCoverageChild, 'children'>;
	const collector: ParsedCoverageParent = {
		children: [],
	};

	const queue: Array<readonly [current: InternalParsedCoverage, parent: ParsedCoverageParent]> = [
		[rootCoverage, collector],
	];

	let item: readonly [current: InternalParsedCoverage, parent: ParsedCoverageParent] | undefined;
	while ((item = queue.shift()) !== undefined) {
		const [current, parent] = item;

		const convertedNode = {
			path: current.path,
			summaryStats: iterator.getStats(current.summary),
			children: [],
			type: current.type,
		};

		parent.children.push(convertedNode);

		const newChildren = [...current.children.values()];
		newChildren.sort((a, b) => {
			if (a.type !== b.type) {
				return a.type === 'file' ? 1 : -1;
			}

			return a.path.localeCompare(b.path);
		});

		queue.push(...newChildren.map((child) => [child, convertedNode] as const));
	}

	if (collector.children.length !== 1) {
		throw new Error('Something went wrong');
	}

	const parsedRootCoverage = collector.children[0];

	const parsedCoverage: ParsedCoverage = {
		children: parsedRootCoverage.children,
		summaryStats: parsedRootCoverage.summaryStats,
		summaryTitles,
	};

	return parsedCoverage;
};
