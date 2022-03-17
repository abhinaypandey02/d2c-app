import {userReducer} from './Reducers/UserReducer';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk from 'redux-thunk';
import {customerReducer} from "./Reducers/CustomerReducer";
import {d2COrderReducer} from "./Reducers/D2COrderReducer";
import {configReducer} from "./Reducers/ConfigReducer";
import {b2bOrderReducer} from "./Reducers/B2BOrderReducer";
import {b2bUserReducer} from "./Reducers/B2BUserReducer";

export const store = createStore(combineReducers({
    user: userReducer,
    customers: customerReducer,
    d2cOrders: d2COrderReducer,
    b2bOrders: b2bOrderReducer,
    config: configReducer,
    b2bUsers: b2bUserReducer
}), applyMiddleware(thunk));
