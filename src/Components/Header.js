import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import * as Constants from '../Constants'
import Feather from 'react-native-vector-icons/Feather';


const Header = ({ navigation, showLogo = true, bgColor = "#ffffff" }) => {
    let cartCount = Constants.StateStore.useState(s => s.cartCount);
    return (
        <View style={{ flexDirection: 'row', marginTop: 0, backgroundColor: bgColor, height: 45 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', paddingTop: 0, paddingLeft: 2 }}>
                <TouchableOpacity onPress={() => { navigation.openDrawer() }}>
                    <Feather
                        name="align-left"
                        style={{ fontSize: 20, color: Constants.colorCode.black, textAlign: 'center', marginTop: 0 }}
                    />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 4, flexDirection: 'row', justifyContent: 'center' }}>
                {showLogo ? (<Image
                    source={Constants.localImages.logo} />) : (<></>)}

            </View>
            <View style={{ flex: 1, alignItems: "center", alignContent: 'center', justifyContent: 'center', flexDirection: "row" }}>

                <TouchableOpacity style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }} onPress={() => { navigation.navigate('CartScreen') }}>
                    {cartCount != 0 ? (<View style={{ width: 16, borderRadius: (16 / 2), height: 16, backgroundColor: "red", justifyContent: "center", alignItems: "center" }} >
                        <Text style={{ fontSize: 8, color: "#fff" }}>{cartCount}</Text>
                    </View>) : (<></>)}
                    <Feather
                        name="shopping-bag"
                        style={{ fontSize: 25, color: Constants.colorCode.black, textAlign: 'center', marginTop: 0 }}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    image_container: {
        height: 50,
        width: '50%',
        justifyContent: 'flex-start',
    },
    logo: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        alignSelf: 'flex-start',
        marginRight: 20
    },
    menuStyle: {
        backgroundColor: Constants._colorBlue,
        width: 80,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10
    }
})