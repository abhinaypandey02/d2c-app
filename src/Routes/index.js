import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerRoutes from './DrawerRoutes'
import HomeScreen from '../Screens/Home/HomeScreen';
import LoginScreen from '../Screens/Auth/LoginScreen';
import ProfileScreen from '../Screens/Auth/ProfileScreen';
import RegisteScreen from '../Screens/Auth/RegisteScreen';
import OrderDetailsScreen from '../Screens/Home/OrderDetailsScreen';
import DeliveredOrders from '../Screens/Home/DeliveredOrders';
import CancledOrders from '../Screens/Home/CancledOrders';
import VendorsOrders from '../Screens/Home/VendorsOrders';
import VendorsOrderDetailsScreen from '../Screens/Home/Vendor/VendorsOrderDetailsScreen';
import VendorCancelledOrders from '../Screens/Home/Vendor/VendorCancelledOrders';
import VendorDeliveredOrders from '../Screens/Home/Vendor/VendorDeliveredOrders';
import ConfirmOrder from "../Screens/Home/ConfirmOrder";
const StackNavigator = createNativeStackNavigator();
const Routes = () => {
    return (
        <StackNavigator.Navigator
            screenOptions={{ headerShown: false, }}>
            <StackNavigator.Screen name="LoginScreen" component={LoginScreen} />
            <StackNavigator.Screen name="HomeScreen" component={HomeScreen} />
            <StackNavigator.Screen name="ConfirmOrder" component={ConfirmOrder} />
            <StackNavigator.Screen name="ProfileScreen" component={ProfileScreen} />
            <StackNavigator.Screen name="RegisteScreen" component={RegisteScreen} />
            <StackNavigator.Screen name="OrderDetailsScreen" component={OrderDetailsScreen} />
            <StackNavigator.Screen name="DeliveredOrders" component={DeliveredOrders} />
            <StackNavigator.Screen name="CancledOrders" component={CancledOrders} />
            <StackNavigator.Screen name="VendorsOrders" component={VendorsOrders} />
            <StackNavigator.Screen name="VendorsOrderDetailsScreen" component={VendorsOrderDetailsScreen} />
            <StackNavigator.Screen name="VendorCancelledOrders" component={VendorCancelledOrders} />
            <StackNavigator.Screen name="VendorDeliveredOrders" component={VendorDeliveredOrders} />
        </StackNavigator.Navigator>
    )
}

export default Routes

const styles = StyleSheet.create({})
