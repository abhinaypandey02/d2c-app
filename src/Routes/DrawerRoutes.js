import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import {Provider as PaperProvider} from 'react-native-paper';
import {createDrawerNavigator} from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../Screens/Home/HomeScreen';
import DrawerLayout from './DrawerLayout'
import LoginScreen from '../Screens/Auth/LoginScreen';
import ProfileScreen from '../Screens/Auth/ProfileScreen';
import RegisteScreen from '../Screens/Auth/RegisteScreen';
import DeliveredOrders from '../Screens/Home/DeliveredOrders';
import CancledOrders from '../Screens/Home/CancledOrders';
const Drawer = createDrawerNavigator();
const StackNavigator = createNativeStackNavigator();
const DrawerRoutes = ({navigation,client,navigate}) => {
    return (
        <>
            <PaperProvider>
                <Drawer.Navigator
                    drawerStyle={{
                        width: '80%',
                    }}
                    screenOptions={{ headerShown: false, }}
                    initialRouteName={HomeScreen}
                    drawerContent={(props) => <DrawerLayout {...props} />}>
                    <Drawer.Screen name="HomeScreen" component={HomeScreen} />
                    <Drawer.Screen name="LoginScreen" component={LoginScreen} />
                    <Drawer.Screen name="ProfileScreen" component={ProfileScreen} />
                    <Drawer.Screen name="RegisteScreen" component={RegisteScreen} />                                     
                   </Drawer.Navigator>
            </PaperProvider>
        </>
    )
}

export default DrawerRoutes

const styles = StyleSheet.create({})
