import * as React from 'react';
import {stylesheet, classes} from "typestyle";
import {
	STICKER_CONTENT_CHANGE,
	STICKER_DELETE,
	STICKER_REORDER_TO_TOP, STICKER_SAVE_LOCAL,
	STICKER_TITLE_CHANGE,
	StickerType
} from "store/Board/types";
import {IRootState} from "store/reducers";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {STICKER_NEAR_ANGLE_PX} from "../utils/const";

interface ISticker {
	onDragStart: (event: React.MouseEvent) => void,
	onMouseDown: (event: React.MouseEvent) => void,
	data: StickerType,
	changeTitle: (id: string, title: string) => void,
	changeContent: (id: string, content: string) => void,
	deleteSticker: (id: string) => void,
	stickerReorderToTop: (id: string) => void,
	saveLocal: () => void,
}

interface IStickerState {
	angleCollision: stickerAngle,
}

export enum stickerAngle {
	TopLeft = 1,
	TopRight = 2,
	BottomLeft = 3,
	BottomRight = 4,
}

export const getAngleCollision = (pointX: number, pointY: number, rect: DOMRect) => {
	if (Math.abs(rect.top - pointY) < STICKER_NEAR_ANGLE_PX
		&& Math.abs(rect.left - pointX) < STICKER_NEAR_ANGLE_PX) {
			return stickerAngle.TopLeft;
	} else if (Math.abs(rect.top - pointY) < STICKER_NEAR_ANGLE_PX
		&& Math.abs(rect.right - pointX) < STICKER_NEAR_ANGLE_PX) {
			return stickerAngle.TopRight;
	} else if (Math.abs(rect.bottom - pointY) < STICKER_NEAR_ANGLE_PX
		&& Math.abs(rect.left - pointX) < STICKER_NEAR_ANGLE_PX) {
			return stickerAngle.BottomLeft;
	} else if (Math.abs(rect.bottom - pointY) < STICKER_NEAR_ANGLE_PX
		&& Math.abs(rect.right - pointX) < STICKER_NEAR_ANGLE_PX) {
			return stickerAngle.BottomRight;
	}
	return null;
};

class Sticker extends React.Component<ISticker> {
	state: IStickerState = {
		angleCollision: null,
	};

	private onMouseMove(e: React.MouseEvent) {
		const target = e.target as HTMLElement;
		this.setState({
			angleCollision: getAngleCollision(e.clientX, e.clientY, target.getBoundingClientRect())
		});
	}

	private get resizeCursorStyle() {
		const { angleCollision } = this.state;
		if (angleCollision === stickerAngle.TopLeft || angleCollision === stickerAngle.BottomRight) {
			return styles.resizeNwse;
		} else if (angleCollision === stickerAngle.TopRight || angleCollision === stickerAngle.BottomLeft) {
			return styles.resizeNesw;
		}
		return null;
	}

	private titleChange(event: React.ChangeEvent) {
		const target = event.target as HTMLInputElement;
		this.props.changeTitle(this.props.data.id, target.value);
	}

	private contentChange(event: React.ChangeEvent) {
		const target = event.target as HTMLTextAreaElement;
		this.props.changeContent(this.props.data.id, target.value);
	}

	private deleteSticker(event: React.MouseEvent) {
		this.props.deleteSticker(this.props.data.id);
		this.props.saveLocal();
		event.stopPropagation();
	}

	private inputClick(event: React.MouseEvent) {
		event.stopPropagation();
		this.props.stickerReorderToTop(this.props.data.id);
	}

	private onMouseDown(event: React.MouseEvent) {
		this.props.onMouseDown(event);
		this.props.stickerReorderToTop(this.props.data.id);
	}

	private onFieldBlur() {
		this.props.saveLocal();
	}

	public render()  {
		const {left, top, width, height, title, content} = this.props.data;
		return (
			<div
				onMouseMove={(e) => this.onMouseMove(e)}
				className={classes(styles.sticker, this.resizeCursorStyle)}
				style={{left, top, width, height}}
				onMouseDown={(e) => this.onMouseDown(e)}
			>
				<div
					className={styles.stickerHeader}
					onMouseDown={(e) => this.props.onDragStart(e)}
				>
					<div className={styles.stickerDeleteIcon} onMouseDown={(e) => this.deleteSticker(e)}>x</div>
				</div>
				<div className={styles.stickerContent}>
					<div>
						<input
							className={styles.titleInput}
							value={title}
							onMouseDown={e => this.inputClick(e)}
							onChange={e => this.titleChange(e)}
							onBlur={() => this.onFieldBlur()}
						/>
					</div>
					<div className={styles.content}>
						<textarea
							className={styles.contentInput}
							onMouseDown={e => this.inputClick(e)}
							onChange={e => this.contentChange(e)}
							value={content}
							onBlur={() => this.onFieldBlur()}
						/>
					</div>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state: IRootState) {
	return {

	}
}

function mapDispatchToProps(dispatch: Dispatch) {
	return {
		changeTitle: (id: string, title: string) => dispatch({type: STICKER_TITLE_CHANGE, id, title}),
		changeContent: (id: string, content: string) =>
			dispatch({type: STICKER_CONTENT_CHANGE, id, content}),
		deleteSticker: (id: string) => dispatch({type: STICKER_DELETE, id}),
		stickerReorderToTop: (id: string) => dispatch({type: STICKER_REORDER_TO_TOP, id}),
		saveLocal: () => dispatch({type: STICKER_SAVE_LOCAL}),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Sticker)

const styles = stylesheet({
	sticker: {
		position: 'fixed',
		background: '#ececec',
		border: '1px solid #c6c6c6',
		display: 'flex',
		flexDirection: 'column',
	},
	stickerHeader: {
		background: '#f2b45f',
		width: '100%',
		height: 15,
		cursor: 'move',
	},
	stickerDeleteIcon: {
		position: 'absolute',
		right: 5,
		height: 15,
		display: 'flex',
		alignItems: 'flex-end',
		fontWeight: 'bold',
		cursor: 'pointer',
	},
	stickerContent: {
		display: 'flex',
		flexDirection: 'column',
		boxSizing: 'border-box',
		padding: 20,
	},
	resizeNwse: {
		cursor: 'nwse-resize',
	},
	resizeNesw: {
		cursor: 'nesw-resize',
	},
	titleInput: {
		fontSize: 18,
		fontWeight: 'bold',
		border: 0,
		background: 'transparent',
		outline: 'none',
		padding: 0,
		width: '100%',
	},
	content: {
		marginTop: 12,
		flexGrow: 1,
		display: 'flex',
	},
	contentInput: {
		flexGrow: 1,
		fontSize: 14,
		border: 0,
		padding: 0,
		outline: 0,
		resize: 'none',
		background: 'transparent',
	},
});
