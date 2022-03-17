import * as ActionTypes from '../ActionTypes';


export const customerReducer = (state = {}, action) => {
    switch (action.type) {
        case ActionTypes.GET_CUSTOMERS: {
            if(action.payload) return {...action.payload};
            return {};
        }
        default:
            return state;
    }
}
