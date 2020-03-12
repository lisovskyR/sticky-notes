import {BoardStateType, reduce as boardReduce} from "./Board/reducer"
import {ExchangeActionTypes} from "./Board/types";

export interface IRootState {
   board: BoardStateType,
}

interface IReducers {
   board: (state: BoardStateType, action: ExchangeActionTypes) => BoardStateType
}

export const reducers: IReducers = {
   board: boardReduce,
};
