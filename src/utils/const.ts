export const MIN_STICKER_WIDTH = 200;
export const MIN_STICKER_HEIGHT = 200;
export const LOCAL_STORAGE_STICKERS_KEY = 'stickers';
export const STICKER_NEAR_ANGLE_PX = 20;

export const DEFAULT_STICKER_DATA = {
	id: '',
	top: window.innerHeight / 2 - MIN_STICKER_HEIGHT / 2,
	left: window.innerWidth / 2 - MIN_STICKER_WIDTH / 2,
	width: MIN_STICKER_WIDTH,
	height: MIN_STICKER_HEIGHT,
	title: 'Title',
	content: 'Content',
};

export const generateStickerId = () => {
	return `sticker-${Date.now()}`;
};
