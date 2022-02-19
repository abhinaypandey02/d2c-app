import React, {useEffect} from 'react'
import {StatusBar, StyleSheet} from 'react-native'
import Routes from './src/Routes'
import {Provider as ReduxStoreProvider} from 'react-redux';
import {Provider as PaperProvider} from 'react-native-paper';
import {store} from './src/Redux/Store'
import {NavigationContainer} from '@react-navigation/native';
import database from '@react-native-firebase/database';
import * as Constants from './src/Constants/index'
import {getCurrentUser} from "./src/Redux/Actions";
import auth from "@react-native-firebase/auth";
store.dispatch(getCurrentUser);

const App = () => {
  useEffect(() => {
    fetchCategories();
    auth().onAuthStateChanged(user=>{
        store.dispatch(getCurrentUser);
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
