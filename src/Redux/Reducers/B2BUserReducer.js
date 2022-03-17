import * as ActionTypes from '../ActionTypes';


export const b2bUserReducer = (state = {}, action) => {
    switch (action.type) {
        case ActionTypes.GET_B2B_USERS: {
            if(action.payload) return {...action.payload};
            return {};
        }
        default:
            return state;
    }
}
