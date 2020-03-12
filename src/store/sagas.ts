import {all} from "redux-saga/effects";
import boardSaga from "./Board/actions"

export default function* rootSaga() {
    yield all([
        boardSaga(),
    ])
}
