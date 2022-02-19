
import React from 'react'
import { StyleSheet, Text, View, StatusBar, Dimensions, } from 'react-native'
const vh = Dimensions.get('screen').height;
import Feather from 'react-native-vector-icons/Feather';
import * as Constants from '../Constants'
import Ripple from 'react-native-material-ripple';

const VendorFooter = ({ navigation }) => {
    const { index, routes } = navigation.getState();
    const currentRoute = routes[index].name;
 
    let isHomeActive = (currentRoute == 'HomeScreen' || currentRoute == 'ProductsScreen') ? true : false;
    let isShopActive = currentRoute == 'CategoriesScreen' ? true : false;
    let isWLActive = currentRoute == 'WishlistScreen' ? true : false;
    let isCartActive = currentRoute == 'CartScreen' ? true : false;
    let isProfieActive = currentRoute == 'ProfileScreen' ? true : false;

    return (
        <View style={styles.bottomTabCardView}>
            <View style={{ flex: 1.2 }}>
                <Ripple
                    onPress={() =>navigation.navigate('VendorsOrders')}
                    style={{ flexDirection: 'column', justifyContent: 'center', alignContent: 'center' }}
                >
                    <Feather
                        name="shopping-bag"
                        style={{ fontSize: 23, color: isWLActive ? Constants.colorCode.black : Constants.colorCode.liteGray, textAlign: 'center', marginTop: 7 }}
                    />
                    <Text style={{ textAlign: 'center', color: isWLActive ? Constants.colorCode.black : Constants.colorCode.liteGray2, fontSize: 12 }}>Vendor's</Text>
                </Ripple>
            </View> 
            <View style={{ flex: 1.2 }}>
                <Ripple
                    onPress={() =>navigation.navigate('VendorCancelledOrders')}
                    style={{ flexDirection: 'column', justifyContent: 'center', alignContent: 'center' }}
                >
                    <Feather
                        name="shopping-bag"
                        style={{ fontSize: 23, color: isShopActive ? Constants.colorCode.black : Constants.colorCode.liteGray, textAlign: 'center', marginTop: 7 }}
                    />
                    <Text style={{ textAlign: 'center', color: isShopActive ? Constants.colorCode.black : Constants.colorCode.liteGray2, fontSize: 12 }}>Cancled</Text>
                </Ripple>
            </View>
            <View style={{ flex: 1.2 }}>
                <Ripple
                    onPress={() =>navigation.navigate('VendorDeliveredOrders')}
                    style={{ flexDirection: 'column', justifyContent: 'center', alignContent: 'center' }}
                >
                    <Feather
                        name="shopping-bag"
                        style={{ fontSize: 23, color: isWLActive ? Constants.colorCode.black : Constants.colorCode.liteGray, textAlign: 'center', marginTop: 7 }}
                    />
                    <Text style={{ textAlign: 'center', color: isWLActive ? Constants.colorCode.black : Constants.colorCode.liteGray2, fontSize: 12 }}>Completed</Text>
                </Ripple>
            </View> 
             
        </View>
    )
}

export default VendorFooter

const styles = StyleSheet.create({
    bottomTabCardView: {
        backgroundColor: Constants.colorCode.white,
        borderTopColor: Constants.colorCode.liteGray,
        borderTopWidth: 1,
        width: '100%',
        height: 55,
        position: 'absolute',
        left: 0,
        bottom: 0,
        flexDirection: 'row'
    }
});
