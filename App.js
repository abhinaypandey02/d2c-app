
import React, {useEffect} from 'react'
import {StatusBar, StyleSheet} from 'react-native'
import Routes from './src/Routes'
import {Provider as ReduxStoreProvider} from 'react-redux';
import {Provider as PaperProvider} from 'react-native-paper';
import {store} from './src/Redux/Store'
import {NavigationContainer} from '@react-navigation/native';
import database from '@react-native-firebase/database';
import * as Constants from './src/Constants/index'

import {
    getCurrentUser,
    getCustomers,
    getDeliveryEarning,
    getD2COrders,
    getB2BOrders,
    getB2BUsers
} from "./src/Redux/Actions";
import firebase from "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";
import {SET_LOADING_PROGRESS} from "./src/Redux/ActionTypes";

export async function reload(user){
    console.log("RELOADING", user )
    store.dispatch({type:SET_LOADING_PROGRESS,payload:15})
    await store.dispatch(getCurrentUser);
    store.dispatch({type:SET_LOADING_PROGRESS,payload:32})
    await store.dispatch(getDeliveryEarning)
    store.dispatch({type:SET_LOADING_PROGRESS,payload:48})
    await store.dispatch(getCustomers);
    store.dispatch({type:SET_LOADING_PROGRESS,payload:64})
    await store.dispatch(getD2COrders)
    store.dispatch({type:SET_LOADING_PROGRESS,payload:80})
    await store.dispatch(getB2BUsers);
    store.dispatch({type:SET_LOADING_PROGRESS,payload:98})
    await store.dispatch(getB2BOrders)
    store.dispatch({type:SET_LOADING_PROGRESS,payload:0})

}
const firebaseConfig = {

    apiKey: "AIzaSyDuXOGANdHY4QHl-0ChxAuAFouzGZwiSqc",

    authDomain: "freshtables-5ca16.firebaseapp.com",

    databaseURL: "https://freshtables-5ca16-default-rtdb.firebaseio.com",

    projectId: "freshtables-5ca16",

    storageBucket: "freshtables-5ca16.appspot.com",

    messagingSenderId: "893322883008",

    appId: "1:893322883008:web:cec382858c5c91e5c06225",

    measurementId: "G-B5T77PJF2X"

};


const App = () => {

  useEffect(() => {
      fetchCategories();
      auth().onAuthStateChanged((user)=>{
          reload();
      })

  }, [])
  const fetchCategories = () => {
    database()
      .ref(Constants.dbpath.category)
      .once('value')
      .then(snapshot => {
        let data = snapshot.val();
        Constants.AppData.categories = data;
        Constants.StateStore.update(s => {
          s.categories = data;
        });
        fetchUnits()
      });
      Constants.getUser();
  }
  const fetchUnits = () => {
    database()
      .ref(Constants.dbpath.unit)
      .once('value')
      .then(snapshot => {
        let data = snapshot.val();
        Constants.AppData.units = data;
        Constants.StateStore.update(s => {
          s.units = data;
        });
      });
  }

  return (
    <ReduxStoreProvider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" hidden={false} backgroundColor={'#ffffff'} />
          <Routes />
        </NavigationContainer>
      </PaperProvider>
    </ReduxStoreProvider>
  )
}

export default App

const styles = StyleSheet.create({})
