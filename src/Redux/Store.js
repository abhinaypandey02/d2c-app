import {userReducer} from './Reducers/UserReducer';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk from 'redux-thunk';

export const store = createStore(combineReducers({user: userReducer}), applyMiddleware(thunk));
