import { Box } from '@primer/react';
import { CoverageItem } from './CoverageItem';
import { PercentCell } from './PercentCell';
import { ParsedCoverage } from '../utils/ParsedCoverage';

export type CoverageTableProps = {
	coverage: ParsedCoverage;
};

export const CoverageTable = ({ coverage }: CoverageTableProps) => (
	<Box
		sx={{
			width: 'calc(100% - 16px)',
			marginX: 2,
			'> :is(tbody, thead, tfoot) > tr > td': {
				paddingX: 2,
				paddingY: 1,
			},
		}}
		as="table"
	>
		<Box as="thead">
			<Box as="tr">
				<Box sx={{ width: '100%' }} as="td"></Box>
				{coverage.summaryTitles.map((title, index) => (
					<Box sx={{ textAlign: 'right' }} key={index} as="td">
						{title}
					</Box>
				))}
			</Box>
		</Box>
		<Box as="tbody">
			{coverage.children.map((value) => (
				<CoverageItem hidden={false} nest={0} coverage={value} key={value.path} />
			))}
		</Box>
		<Box as="tfoot">
			<Box as="tr">
				<Box paddingLeft={5} fontWeight="bold" as="td">
					Total
				</Box>
				{coverage.summaryStats.map((percent, index) => (
					<PercentCell percent={percent} key={index} />
				))}
			</Box>
		</Box>
	</Box>
);
