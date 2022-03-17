import * as ActionTypes from './ActionTypes';
import {
  getCurrentUserDB,
  getCustomersDB,
  getDeliveryEarningDB,
  getD2COrdersDB,
  setCurrentUserDB, getB2BOrdersDB, getB2BUsersDB
} from "../Firebase/database";
import {getCurrentUserAuth} from "../Firebase/auth";

export async function getCurrentUser(dispatch,getState){
  const user=await getCurrentUserDB();
  dispatch({
    type:ActionTypes.GET_CURRENT_USER,
    payload:user
  })
}
export function setCurrentUser(user){
  return async (dispatch,getState)=>{
    await setCurrentUserDB(user);
    console.log(21, user)
    dispatch({
      type:ActionTypes.SET_CURRENT_USER,
      payload:user
    })
  }
}
export async function getCustomers(dispatch){
  const customers=await getCustomersDB();
  dispatch({
    type:ActionTypes.GET_CUSTOMERS,
    payload:customers
  })
}
export async function getB2BUsers(dispatch){
  const users=await getB2BUsersDB();
  dispatch({
    type:ActionTypes.GET_B2B_USERS,
    payload:users
  })
}
export async function getD2COrders(dispatch, getState){
  const orders=await getD2COrdersDB();
  const currentUser=getState().user;
  if(!currentUser.name||!orders) return;
  dispatch({type:ActionTypes.CLEAR_D2C_ORDERS});
  Object.keys(orders).map((userid) => {
    Object.keys(orders[userid]).map((oid) => {
      const o=orders[userid][oid];
      if(o.deliveryBoyIDs && o.deliveryBoyIDs[o.deliveryBoyIDs.length - 1].userid === currentUser.userid){
        dispatch({
          type:ActionTypes.ADD_D2C_ORDER,
          payload:o
        })
      }
    })
  })
}
export async function getB2BOrders(dispatch, getState){
  const orders=await getB2BOrdersDB();
  const currentUser=getState().user;
  if(!currentUser.name||!orders) return;

  dispatch({type:ActionTypes.CLEAR_B2B_ORDERS});
  Object.keys(orders).map((userid) => {
    Object.keys(orders[userid]).map((oid) => {
      const o=orders[userid][oid];
      if(o.deliveryBoyIDs && o.deliveryBoyIDs === currentUser.userid){
        console.log(oid)
        dispatch({
          type:ActionTypes.ADD_B2B_ORDER,
          payload: {...o,accessKey:oid}
        })
      }
    })
  })
}
export async function getDeliveryEarning(dispatch){
  const earnings=await getDeliveryEarningDB();
  if(typeof earnings === "number"){
    dispatch({
      type:ActionTypes.GET_DELIVERY_EARNING,
      payload:earnings
    })
  }
}
