import * as ActionTypes from '../ActionTypes';


export const d2COrderReducer = (state = null, action) => {
    switch (action.type) {
        case ActionTypes.CLEAR_D2C_ORDERS: {
            return [];
        }
        case ActionTypes.ADD_D2C_ORDER:{
            return [...state,action.payload]
        }
        default:
            return state;
    }
}
