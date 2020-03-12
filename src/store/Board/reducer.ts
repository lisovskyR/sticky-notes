import {
    STICKER_CONTENT_CHANGE,
    STICKER_DELETE,
    STICKER_LOAD_LOCAL,
    STICKER_LOAD_SERVER_END,
    STICKER_LOAD_SERVER_START,
    STICKER_NEW,
    STICKER_REORDER_TO_TOP,
    STICKER_SAVE_SERVER_END,
    STICKER_SAVE_SERVER_START,
    STICKER_TITLE_CHANGE,
    STICKER_UPDATE_POSITION,
    StickerType,
    ExchangeActionTypes,
} from './types';
import * as SeamlessImmutable from "seamless-immutable";
import {ImmutableArray} from "seamless-immutable";
import {IRootState} from "store/reducers";
import {DEFAULT_STICKER_DATA, generateStickerId, LOCAL_STORAGE_STICKERS_KEY} from "utils/const";

export interface IBoardState {
    stickers: StickerType[],
    isPendingRequest: boolean,
}
export type BoardStateType = SeamlessImmutable.Immutable<IBoardState>;

const initialState: BoardStateType = SeamlessImmutable({
    stickers: [],
    isPendingRequest: false,
});

export const reduce = (state: BoardStateType = initialState, action: ExchangeActionTypes): BoardStateType =>  {
    switch (action.type) {
        case STICKER_UPDATE_POSITION: {
            const stickers = state.stickers.asMutable({deep: true});
            const stickerIndex = stickers.findIndex(item => item.id === action.id);
            stickers[stickerIndex] = Object.assign(stickers[stickerIndex], action.position);
            return state.merge({
                stickers,
            });
        }
        case STICKER_TITLE_CHANGE: {
            const stickers = state.stickers.asMutable({deep: true});
            const stickerIndex = stickers.findIndex(item => item.id === action.id);
            stickers[stickerIndex].title = action.title;
            return state.merge({
                stickers,
            });
        }
        case STICKER_CONTENT_CHANGE: {
            const stickers = state.stickers.asMutable({deep: true});
            const stickerIndex = stickers.findIndex(item => item.id === action.id);
            stickers[stickerIndex].content = action.content;
            return state.merge({
                stickers,
            });
        }
        case STICKER_NEW: {
            const stickers = state.stickers.asMutable({deep: true});
            const newSticker = {...DEFAULT_STICKER_DATA, id: generateStickerId()};
            stickers.push(newSticker);
            return state.merge({
                stickers,
            });
        }
        case STICKER_DELETE: {
            const stickers = state.stickers.asMutable({deep: true});
            const stickerIndex = stickers.findIndex(item => item.id === action.id);
            stickers.splice(stickerIndex, 1);
            return state.merge({
                stickers,
            });
        }
        case STICKER_REORDER_TO_TOP: {
            const stickers = state.stickers.asMutable({deep: true});
            const stickerIndex = stickers.findIndex(item => item.id === action.id);
            const stickersToMove = stickers.splice(stickerIndex, 1);
            stickers.push(stickersToMove[0]);
            return state.merge({
                stickers,
            });
        }
        case STICKER_LOAD_LOCAL: {
            const stickersRaw = window.localStorage.getItem(LOCAL_STORAGE_STICKERS_KEY);
            if (stickersRaw) {
                return state.merge({
                    stickers: JSON.parse(stickersRaw)
                })
            }
            return state;
        }
        case STICKER_LOAD_SERVER_START: {
            return state.merge({
                isPendingRequest: true,
            })
        }
        case STICKER_LOAD_SERVER_END: {
            return state.merge({
                isPendingRequest: false,
                stickers: action.stickers,
            })
        }
        case STICKER_SAVE_SERVER_START: {
            return state.merge({
                isPendingRequest: true,
            })
        }
        case STICKER_SAVE_SERVER_END: {
            return state.merge({
                isPendingRequest: false,
            })
        }
        default:
            return state
    }
};

export function getStickers(state: IRootState): ImmutableArray<StickerType> {
    return state.board.stickers;
}

export function getIsPendingRequest(state: IRootState): boolean {
    return state.board.isPendingRequest;
}
