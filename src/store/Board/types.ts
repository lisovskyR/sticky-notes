export const STICKER_UPDATE_POSITION = "sticker.updatePosition";
export const STICKER_TITLE_CHANGE = "sticker.titleChange";
export const STICKER_CONTENT_CHANGE = "sticker.contentChange";
export const STICKER_NEW = 'sticker.new';
export const STICKER_DELETE = 'sticker.delete';
export const STICKER_REORDER_TO_TOP = 'sticker.reorderToTop';
export const STICKER_SAVE_LOCAL = 'sticker.saveLocal';
export const STICKER_LOAD_LOCAL = 'sticker.loadLocal';
export const STICKER_LOAD_SERVER_START = 'sticker.loadServerStart';
export const STICKER_LOAD_SERVER_END = 'sticker.loadServerEnd';
export const STICKER_SAVE_SERVER_START = 'sticker.saveServerStart';
export const STICKER_SAVE_SERVER_END = 'sticker.saveServerEnd';

export type StickerType = {
	id: string,
	left: number,
	top: number,
	width: number,
	height: number,
	title: string,
	content: string,
}

export type StickerPositionType = {
	left?: number,
	top?: number,
	width?: number,
	height?: number,
}

export interface StickerUpdatePositionAction {
	type: typeof STICKER_UPDATE_POSITION,
	id: string,
	position: StickerPositionType,
}

export interface StickerTitleChangeAction {
	type: typeof STICKER_TITLE_CHANGE,
	id: string,
	title: string,
}

export interface StickerContentChangeAction {
	type: typeof STICKER_CONTENT_CHANGE,
	id: string,
	content: string,
}

export interface StickerNewAction {
	type: typeof STICKER_NEW,
}

export interface StickerDeleteAction {
	type: typeof STICKER_DELETE,
	id: string,
}

export interface StickerReorderToTopAction {
	type: typeof STICKER_REORDER_TO_TOP,
	id: string,
}

export interface StickerSaveLocalAction {
	type: typeof STICKER_SAVE_LOCAL,
	stickers: StickerType[],
}

export interface StickerLoadLocalAction {
	type: typeof STICKER_LOAD_LOCAL,
}

export interface StickerLoadServerStartAction {
	type: typeof STICKER_LOAD_SERVER_START,
}

export interface StickerLoadServerEndAction {
	type: typeof STICKER_LOAD_SERVER_END,
	stickers: StickerType[],
}

export interface StickerSaveServerStartAction {
	type: typeof STICKER_SAVE_SERVER_START,
	stickers: StickerType[],
}

export interface StickerSaveServerEndAction {
	type: typeof STICKER_SAVE_SERVER_END,
}

export type ExchangeActionTypes =
	StickerUpdatePositionAction |
	StickerTitleChangeAction |
	StickerContentChangeAction |
	StickerNewAction |
	StickerDeleteAction |
	StickerReorderToTopAction |
	StickerSaveLocalAction |
	StickerLoadLocalAction |
	StickerLoadServerStartAction |
	StickerLoadServerEndAction |
	StickerSaveServerStartAction |
	StickerSaveServerEndAction;

