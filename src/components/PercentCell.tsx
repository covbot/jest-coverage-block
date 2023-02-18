import { Box } from '@primer/react';

export type PercentCellProps = {
	percent: number;
};

const getColor = (percent: number) => {
	if (percent > 80) {
		return 'success.fg';
	}

	if (percent > 60) {
		return 'attention.fg';
	}

	if (percent > 40) {
		return 'severe.fg';
	}

	return 'danger.fg';
};

export const PercentCell = ({ percent }: PercentCellProps) => {
	const color = getColor(percent);

	return (
		<Box
			sx={{
				fontVariantNumeric: 'tabular-nums',
				textAlign: 'right',
			}}
			as="td"
			color={color}
		>
			{percent.toFixed(1)}%
		</Box>
	);
};
