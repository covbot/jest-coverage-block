import { FileIcon, FileDirectoryIcon, FileDirectoryOpenFillIcon, FileDirectoryFillIcon } from '@primer/styled-octicons';
import { ParsedCoverageChild } from '../utils/ParsedCoverage';

export type CoverageItemIconProps = Pick<ParsedCoverageChild, 'type'> & {
	expanded?: boolean;
	isEmpty?: boolean;
};

export const CoverageItemIcon = ({ type, isEmpty, expanded }: CoverageItemIconProps) => {
	if (type === 'file') {
		return <FileIcon />;
	}

	if (isEmpty) {
		return <FileDirectoryIcon />;
	}

	if (expanded) {
		return <FileDirectoryOpenFillIcon color="treeViewItem.directory.fill" />;
	}

	return <FileDirectoryFillIcon color="treeViewItem.directory.fill" />;
};
