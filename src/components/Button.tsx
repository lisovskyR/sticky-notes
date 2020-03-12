import * as React from 'react';
import {classes, stylesheet} from "typestyle";

interface IButton {
	onClick: () => void,
	children: React.ReactNode,
	disabled?: boolean,
}

export const Button: React.FunctionComponent<IButton> = (props) => {
	return (
		<div
			className={classes(styles.button, props.disabled && styles.disabled)}
			onClick={(e) => !props.disabled && props.onClick()}
		>
			{props.children}
		</div>
	)
};

const styles = stylesheet({
	button: {
		background: '#0d81ff',
		color: 'white',
		padding: '8px 16px',
		textAlign: 'center',
		textTransform: 'uppercase',
		cursor: 'pointer',
		userSelect: 'none',
		$nest: {
			'&:hover': {
				background: '#0d59ff',
			}
		}
	},
	disabled: {
		background: '#5baaff !important',
	}
});
