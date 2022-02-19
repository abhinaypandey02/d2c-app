import * as ActionTypes from '../ActionTypes';


export const userReducer = (state = {isLoaded:false,isLoggedIn:false}, action) => {
    switch (action.type) {
        case ActionTypes.GET_CURRENT_USER: {
            if(action.payload) return {...action.payload, isLoaded: true, isLoggedIn: true}
            return {isLoaded:true,isLoggedIn:false};
        }
        case ActionTypes.SET_CURRENT_USER: {
            if(action.payload) return {...state,...action.payload}
            return null;
        }
        default:
            return state;
    }
}
