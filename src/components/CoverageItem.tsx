import { Box } from '@primer/react';
import { Fragment, useState } from 'react';
import { CoverageItemIcon } from './CoveargeItemIcon';
import { PercentCell } from './PercentCell';
import { ParsedCoverage } from '../utils/ParsedCoverage';

export type CoverageItemProps = {
	coverage: ParsedCoverage;
	nest: number;
	hidden: boolean;
};

export const CoverageItem = ({ coverage, nest, hidden }: CoverageItemProps) => {
	const { path, children, summary } = coverage;
	const [isExpanded, setIsExpanded] = useState(false);

	if (hidden) {
		// eslint-disable-next-line unicorn/no-null
		return null;
	}

	return (
		<Fragment>
			<Box
				as="tr"
				sx={{
					cursor: 'pointer',
					userSelect: 'none',
					':hover': {
						'> td': {
							backgroundColor: 'actionListItem.default.hoverBg',
						},
					},
					'> td': {},
					'> td:first-child': {
						borderTopLeftRadius: 2,
						borderBottomLeftRadius: 2,
					},
					'> td:last-child': {
						borderTopRightRadius: 2,
						borderBottomRightRadius: 2,
					},
				}}
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<Box as="td">
					<Box display="flex" alignItems="center" sx={{ gap: 2, paddingLeft: nest * 2 }}>
						<CoverageItemIcon {...coverage} expanded={isExpanded} />
						{path}
					</Box>
				</Box>
				<PercentCell percent={summary.lines.pct} />
				<PercentCell percent={summary.statements.pct} />
				<PercentCell percent={summary.branches.pct} />
				<PercentCell percent={summary.functions.pct} />
			</Box>

			{children.map((value) => (
				<CoverageItem nest={nest + 1} hidden={!isExpanded} coverage={value} key={value.path} />
			))}
		</Fragment>
	);
};
