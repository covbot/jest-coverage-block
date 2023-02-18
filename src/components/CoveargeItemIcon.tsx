import { FileIcon, FileDirectoryIcon, FileDirectoryOpenFillIcon, FileDirectoryFillIcon } from '@primer/styled-octicons';
import { ParsedCoverage } from '../utils/ParsedCoverage';

export type CoverageItemIconProps = ParsedCoverage & {
	expanded?: boolean;
};

export const CoverageItemIcon = (coverage: CoverageItemIconProps) => {
	if (coverage.type === 'file') {
		return <FileIcon />;
	}

	if (coverage.children.length === 0) {
		return <FileDirectoryIcon />;
	}

	if (coverage.expanded) {
		return <FileDirectoryOpenFillIcon color="treeViewItem.directory.fill" />;
	}

	return <FileDirectoryFillIcon color="treeViewItem.directory.fill" />;
};
