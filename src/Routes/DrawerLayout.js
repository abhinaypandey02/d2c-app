import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Avatar, Caption, Drawer, Text } from 'react-native-paper';
import { CommonActions } from '@react-navigation/native';
import * as Constants from '../Constants'
const DrawerLayout = (props) => {
    let categories = Constants.StateStore.useState(s => s.categories);
    const { index, routes } = props.navigation.getState();
    const currentRoute = routes[index].name;
    const menuList = [];
    // const {navigate} = props;
    Object.keys(categories).map((catid)=>{
        if(!categories[catid].hide && !categories[catid].showinside)
        menuList.push({ 'label': categories[catid].title, 'iconProvider': 'FontAwesome', 'navigateTo': 'ProductsScreen', 'iconName': 'home', 'style': {} });

    })
    menuList.push({ 'label': 'My Orders', 'iconProvider': 'FontAwesome', 'navigateTo': 'OrderScreen', 'iconName': 'home', 'style': {} });
    return (
        <View style={{ flex: 1, backgroundColor: 'transparent' }}>
            <DrawerContentScrollView
                {...props}
                style={{ marginTop: 0, paddingLeft: 0, backgroundColor: '#fff' }}>
                <View style={{flexDirection:'column',}}>
                    <Text style={{ fontSize: 23, marginBottom:14,paddingLeft:15 }}>Categories</Text>
                    {menuList.map((menuItem,i) => (
                        <View key={i} style={{
                        borderBottomColor:Constants.colorCode.liteGray,
                        borderBottomWidth:1,
                        paddingVertical:12,
                        paddingLeft:15}}>
                        <TouchableOpacity onPress={()=>{
                            // navigation.navigate('WishlistScreen')
                            Constants.route.params={ name:menuItem.label };
                            props.navigation.dispatch(
                                CommonActions.navigate({
                                  name: menuItem.navigateTo,
                                  params: {name:menuItem.label },
                                })
                              );
                        }}>
                            <Text style={[{fontSize:18}]}>{menuItem.label}</Text>
                        </TouchableOpacity>
                    </View>
                    ))}
                </View>
            </DrawerContentScrollView>
        </View>
    )
}

export default DrawerLayout

const styles = StyleSheet.create({})
