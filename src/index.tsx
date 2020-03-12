import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {App} from './App';
import {reducers} from './store/reducers'
import rootSaga from './store/sagas'
import {createStore, applyMiddleware, combineReducers, compose} from 'redux'
import {Provider} from 'react-redux'
import createMiddlewareSaga from 'redux-saga'

const sagaMiddleware = createMiddlewareSaga();
const reduxDevTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__
	? (window as any).__REDUX_DEVTOOLS_EXTENSION__()
	: (f: any) => f;

const store = createStore(
	combineReducers(reducers),
	compose(
		applyMiddleware(sagaMiddleware),
		reduxDevTools
	)
);

sagaMiddleware.run(rootSaga);

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);
