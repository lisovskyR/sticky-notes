import {
    STICKER_LOAD_SERVER_END,
    STICKER_LOAD_SERVER_START,
    STICKER_SAVE_LOCAL,
    STICKER_SAVE_SERVER_END,
    STICKER_SAVE_SERVER_START,
    StickerLoadServerStartAction,
    StickerSaveLocalAction,
    StickerSaveServerStartAction,
    StickerType,
} from "./types"
import {takeLatest, call, put, all, select} from "redux-saga/effects";
import {LOCAL_STORAGE_STICKERS_KEY} from "utils/const";
import {serverMock} from "utils/serverMock";
import {getStickers} from "./reducer";

/* WORKERS */

function* saveLocal(action: StickerSaveLocalAction) {
    const stickers = yield select(getStickers);
    window.localStorage.setItem(LOCAL_STORAGE_STICKERS_KEY, JSON.stringify(stickers.asMutable({deep: true})));
}

function* loadServer(action: StickerLoadServerStartAction) {
    const response = yield call(() => {
        return serverMock.loadRequest();
    });
    if (response.status === 200) {
        const stickers: StickerType[] = JSON.parse(response.data);
        yield put({type: STICKER_LOAD_SERVER_END, stickers});
    }
}

function* saveServer(action: StickerSaveServerStartAction) {
    const stickers = yield select(getStickers);
    const response = yield call(() => {
        return serverMock.saveRequest(JSON.stringify(stickers.asMutable({deep: true})));
    });
    if (response.status === 200) {
        yield put({type: STICKER_SAVE_SERVER_END});
    }
}

/* WATCHERS */

function* watchSaveLocal() {
    yield takeLatest(STICKER_SAVE_LOCAL, saveLocal)
}

function* watchSaveServer() {
    yield takeLatest(STICKER_SAVE_SERVER_START, saveServer)
}

function* watchLoadServer() {
    yield takeLatest(STICKER_LOAD_SERVER_START, loadServer)
}

export default function* root() {
    yield all([
        watchSaveLocal(),
        watchSaveServer(),
        watchLoadServer(),
    ])
}
