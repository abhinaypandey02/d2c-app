import * as ActionTypes from '../ActionTypes';


export const userReducer = (state = {isLoaded:false,isLoggedIn:false}, action) => {
    switch (action.type) {
        case ActionTypes.GET_CURRENT_USER: {
            if(action.payload===-1) return {isLoaded: true, isLoggedIn: true}
            if(action.payload===-2) return {isLoaded: true, isLoggedIn: false}
            if(action.payload) return {...action.payload, isLoaded: true, isLoggedIn: true}
            return {isLoaded:true,isLoggedIn:false};
        }
        case ActionTypes.SET_CURRENT_USER: {
            if(action.payload) return {...state,...action.payload}
            return {...state};
        }
        case ActionTypes.CLEAR_CURRENT_USER:{
            return {isLoaded:true,isLoggedIn:false}
        }
        default:
            return state;
    }
}
