import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import Feather from 'react-native-vector-icons/Feather';
import * as Constants from '../Constants'
import Ripple from 'react-native-material-ripple';


const data = [{name: "Pending", route: "HomeScreen", icon: "shopping-bag"}, {
    name: "Canceled",
    route: "CancledOrders",
    icon: "shopping-bag"
}, {name: "Completed", route: "DeliveredOrders", icon: "shopping-bag"}, {
    name: "Vendors",
    route: "VendorsOrders",
    icon: "shopping-bag"
}, {name: "Me", route: "ProfileScreen", icon: "user"},]

const Footer = ({navigation}) => {
    const {index, routes} = navigation.getState();
    const currentRoute = routes[index].name;
    return (<View style={styles.bottomTabCardView}>
            {data.map((r,index) => <View key={index} style={{flex: 1.2}}>
                <Ripple
                    onPress={() => {
                        if(index===0) navigation.reset({index: 0, routes: [{name: r.route}]})
                        else navigation.navigate(r.route);
                    }}
                    style={{flexDirection: 'column', justifyContent: 'center', alignContent: 'center'}}
                >
                    <Feather
                        name={r.icon}
                        style={{
                            fontSize: 23,
                            color: currentRoute === r.route ? Constants.colorCode.black : Constants.colorCode.liteGray,
                            textAlign: 'center',
                            marginTop: 7
                        }}
                    />
                    <Text style={{
                        fontSize: 12,
                        color: currentRoute === r.route ? Constants.colorCode.black : Constants.colorCode.liteGray2,
                        textAlign: 'center'
                    }}>{r.name}</Text>
                </Ripple>
            </View>)}

        </View>)
}

export default Footer

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
