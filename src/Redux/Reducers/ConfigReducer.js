import * as ActionTypes from '../ActionTypes';


export const configReducer = (state = {deliveryEarnings: 0,loadingProgress:0}, action) => {
    switch (action.type) {
        case ActionTypes.GET_DELIVERY_EARNING: {
            if(typeof action.payload === "number") return {...state,deliveryEarnings:action.payload};
            return {};
        }
        case ActionTypes.SET_LOADING_PROGRESS: {
            if(typeof action.payload === "number") return {...state,loadingProgress:action.payload};
            return {};
        }
        default:
            return state;
    }
}
