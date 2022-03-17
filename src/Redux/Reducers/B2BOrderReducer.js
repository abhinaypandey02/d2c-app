import * as ActionTypes from '../ActionTypes';


export const b2bOrderReducer = (state = null, action) => {
    switch (action.type) {
        case ActionTypes.CLEAR_B2B_ORDERS: {
            return [];
        }
        case ActionTypes.ADD_B2B_ORDER:{
            return [...state,action.payload]
        }
        default:
            return state;
    }
}
