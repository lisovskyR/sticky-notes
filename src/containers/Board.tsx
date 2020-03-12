import * as React from 'react';
import {stylesheet} from "typestyle";
import Sticker, {getAngleCollision, stickerAngle} from "./Sticker";
import {Button} from "components/Button";
import {getIsPendingRequest, getStickers} from "store/Board/reducer";
import {IRootState} from "store/reducers";
import {Dispatch} from "redux";
import {
	STICKER_LOAD_LOCAL,
	STICKER_LOAD_SERVER_START,
	STICKER_NEW, STICKER_SAVE_LOCAL,
	STICKER_SAVE_SERVER_START,
	STICKER_UPDATE_POSITION,
	StickerPositionType,
	StickerType
} from "store/Board/types";
import {connect} from 'react-redux';
import {ImmutableArray} from "seamless-immutable";
import {MIN_STICKER_HEIGHT, MIN_STICKER_WIDTH} from "utils/const";

interface IBoardProps {
	stickers: ImmutableArray<StickerType>,
	updateStickerPosition: (id: string, position: StickerPositionType) => void,
	newSticker: () => void,
	saveLocal: (stickers: StickerType[]) => void,
	loadLocal: () => void,
	saveServer: (stickers: StickerType[]) => void,
	loadServer: () => void,
	isPendingRequest: boolean,
}

interface IBoardState {
	stickerDragging?: StickerDraggingType,
	stickerResizing?: StickerResizingType,
}

type StickerDraggingType = {
	id: string,
	mouseOffsetX: number,
	mouseOffsetY: number,
}

type StickerResizingType = {
	id: string,
	angle: stickerAngle,
}

class Board extends React.Component<IBoardProps> {
	state: IBoardState = {
		stickerDragging: null,
		stickerResizing: null,
	};

	public componentDidMount(): void {
		this.props.loadLocal();
	}

	private onItemDragStart(event: React.MouseEvent, id: string) {
		const sticker = this.props.stickers.find(item => item.id === id);
		this.setState({
			stickerDragging: {
				id,
				mouseOffsetX: event.clientX - sticker.left,
				mouseOffsetY: event.clientY - sticker.top,
			},
		})
	}

	private onItemMouseDown(event: React.MouseEvent, id: string) {
		const target = event.target as HTMLElement;
		const angle = getAngleCollision(event.clientX, event.clientY, target.getBoundingClientRect());
		if (angle) {
			this.setState({
				stickerResizing: {
					id,
					angle,
				}
			})
		}
	}

	private onMouseMove(event: React.MouseEvent) {
		const {stickerDragging, stickerResizing} = this.state;
		if (stickerDragging) {
			this.props.updateStickerPosition(
				stickerDragging.id,
				{
					left: event.clientX - stickerDragging.mouseOffsetX,
					top: event.clientY - stickerDragging.mouseOffsetY,
				}
			);
		} else if (stickerResizing) {
			const sticker = this.props.stickers.find(item => item.id === stickerResizing.id);
			switch (stickerResizing.angle) {
				case stickerAngle.BottomRight: {
					const canChangeWidth = event.clientX - sticker.left >= MIN_STICKER_WIDTH;
					const canChangeHeight = event.clientY - sticker.top >= MIN_STICKER_HEIGHT;
					this.props.updateStickerPosition(
						stickerResizing.id,
						{
							width: canChangeWidth ? event.clientX - sticker.left : sticker.width,
							height: canChangeHeight ? event.clientY - sticker.top : sticker.height,
						}
					);
					return;
				}
				case stickerAngle.BottomLeft: {
					const canChangeWidth = sticker.left + sticker.width - event.clientX >= MIN_STICKER_WIDTH;
					const canChangeHeight = event.clientY - sticker.top >= MIN_STICKER_HEIGHT;
					this.props.updateStickerPosition(
						stickerResizing.id,
						{
							width: canChangeWidth ? sticker.left + sticker.width - event.clientX : sticker.width,
							height: canChangeHeight ? event.clientY - sticker.top : sticker.height,
							left: canChangeWidth ? event.clientX : sticker.left,
						}
					);
					return;
				}
				case stickerAngle.TopLeft: {
					const canChangeWidth = sticker.left + sticker.width - event.clientX >= MIN_STICKER_WIDTH;
					const canChangeHeight = sticker.top + sticker.height - event.clientY >= MIN_STICKER_HEIGHT;
					this.props.updateStickerPosition(
						stickerResizing.id,
						{
							width: canChangeWidth ? sticker.left + sticker.width - event.clientX : sticker.width,
							height: canChangeHeight ? sticker.top + sticker.height - event.clientY : sticker.height,
							left: canChangeWidth ? event.clientX : sticker.left,
							top: canChangeHeight ? event.clientY : sticker.top,
						}
					);
					return;
				}
				case stickerAngle.TopRight: {
					const canChangeHeight = sticker.top + sticker.height - event.clientY >= MIN_STICKER_HEIGHT;
					const canChangeWidth = event.clientX - sticker.left >= MIN_STICKER_WIDTH;
					this.props.updateStickerPosition(
						stickerResizing.id,
						{
							width: canChangeWidth ? event.clientX - sticker.left : sticker.width,
							height: canChangeHeight ? sticker.top + sticker.height - event.clientY : sticker.height,
							top: canChangeHeight ? event.clientY : sticker.top,
						}
					);
					return;
				}
			}
		}
	}

	private onMouseUp(event: React.MouseEvent) {
		this.setState({
			stickerDragging: null,
			stickerResizing: null,
		});
		this.saveLocal();
	}

	private newStickerClick() {
		this.props.newSticker();
		this.saveLocal();
	}

	private saveLocal() {
		this.props.saveLocal(this.props.stickers.asMutable({deep: true}));
	}

	private saveServerClick() {
		this.props.saveServer(this.props.stickers.asMutable({deep: true}));
	}

	private loadServerClick() {
		this.props.loadServer();
	}

	public render()  {
		return (
			<div
				className={styles.board}
				onMouseMove={(e) => this.onMouseMove(e)}
				onMouseUp={(e) => this.onMouseUp(e)}
			>
				{this.props.stickers.map(sticker => (
					<Sticker
						key={sticker.id}
						data={sticker}
						onDragStart={(e) => this.onItemDragStart(e, sticker.id)}
						onMouseDown={(e) => this.onItemMouseDown(e, sticker.id)}
						saveLocal={() => this.saveLocal}
					/>
				))}
				<div className={styles.topButtons}>
					<Button onClick={() => this.loadServerClick()} disabled={this.props.isPendingRequest}>
						Load from server (mock)
					</Button>
					<Button onClick={() => this.saveServerClick()} disabled={this.props.isPendingRequest}>
						Save to server (mock)
					</Button>
					<Button onClick={() => this.newStickerClick()}>New note</Button>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state: IRootState) {
	return {
		stickers: getStickers(state),
		isPendingRequest: getIsPendingRequest(state),
	}
}

function mapDispatchToProps(dispatch: Dispatch) {
	return {
		updateStickerPosition: (id: string, position: StickerPositionType) =>
			dispatch({type: STICKER_UPDATE_POSITION, id, position}),
		newSticker: () => dispatch({type: STICKER_NEW}),
		saveLocal: (stickers: StickerType[]) => dispatch({type: STICKER_SAVE_LOCAL, stickers}),
		loadLocal: () => dispatch({type: STICKER_LOAD_LOCAL}),
		saveServer: (stickers: StickerType[]) => dispatch({type: STICKER_SAVE_SERVER_START, stickers}),
		loadServer: () => dispatch({type: STICKER_LOAD_SERVER_START}),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Board)

const styles = stylesheet({
	board: {
		width: '100%',
		height: '100%',
	},
	topButtons: {
		top: 16,
		right: 16,
		position: 'fixed',
	}
});
