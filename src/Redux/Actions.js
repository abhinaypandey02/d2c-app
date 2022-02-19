import * as ActionTypes from './ActionTypes';
import {getCurrentUserDB} from "../Firebase/database";

export async function getCurrentUser(dispatch,getState){

  const user=await getCurrentUserDB();
  dispatch({
    type:ActionTypes.GET_CURRENT_USER,
    payload:user
  })
}
export function setCurrentUser(user){
  return async (dispatch,getState)=>{
    await setCurrentUser(user);
    dispatch({
      type:ActionTypes.SET_CURRENT_USER,
      payload:user
    })
  }
}
