import { StyleSheet, Text, View, ScrollView, Image, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as Constants from '../../../Constants/index'
import { useIsFocused } from "@react-navigation/native";
import database from "@react-native-firebase/database";
import Feather from 'react-native-vector-icons/Feather';
import { Provider as PaperProviderProd } from 'react-native-paper';
import Ripple from 'react-native-material-ripple';
import VendorFooter from '../../../Components/VendorFooter';


const VendorDeliveredOrders = ({ navigation }) => {
    const isFocused = useIsFocused();
    const [orderItems, setOrderItems] = useState("")
    const [isDataLoading, setisDataLoading] = useState(true)

    useEffect(() => {
        fetchOrderItems()
    }, [isFocused])
    const getLastUser = (deliveryBoys = []) => {
        let lastUser = { userid: "", time: "" };
        deliveryBoys.forEach(element => {
            lastUser = element;
        });
        return lastUser;
    }
    const fetchOrderItems = () => {
        if (Constants.AppData.user.phone != "" && !Constants.AppData.user.isBlocked) {
            let deliverBoyUserid = Constants.AppData.user.userid;
            setisDataLoading(true)
            database()
                .ref('order')
                .once('value')
                .then(snapshot => {
                    let data = snapshot.val();
                    if (data) {
                        let orderz = []
                        Object.keys(data).map((userid) => {
                            Object.keys(data[userid]).map((oid) => {
                                if ((data[userid][oid].deliveryBoyIDs || "") === deliverBoyUserid) {
                                    if (data[userid][oid].status == "delievered") {
                                        let odrObj = {...data[userid][oid]};
                                        odrObj['dbokey']=oid;
                                        odrObj['dbukey']=userid;
                                        orderz.push(odrObj)
                                    }
                                }
                            })
                        })
                        if (orderz.length > 0) {
                            orderz.sort((a, b) => b.createdAt - a.createdAt)
                        }
                        setOrderItems(orderz)
                    }
                    setisDataLoading(false)
                });
        }
        // database()
        //     .ref('users')
        //     .once('value')
        //     .then(snapshot => {
        //         let data = snapshot.val();
        //         if (data) {
        //             Constants.AppData.vendorCustomers = data;
        //         }
        //     });
    }
    return (
        <>
            <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
                <View style={{
                    justifyContent: "center", width: "100%",
                    alignItems: "center",
                    borderBottomColor: Constants.colorCode.liteGray,
                    borderBottomWidth: 1,
                    paddingBottom: 20
                }}>
                    <Text style={{ fontSize: 20, color: "#000" }}>Vendors delivered Deliveries</Text>
                </View>
                {isDataLoading && (<ActivityIndicator color={"#000"} />)}
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={[{ flex: 1 }]}>
                    {orderItems.length > 0 ? (
                        <View style={{ flex: 1, paddingHorizontal: 5, marginBottom: 65, justifyContent: "flex-start" }}>
                            {
                                orderItems.map((order) => {

                                    return (
                                        <Ripple
                                            style={{
                                                borderBottomWidth: 1,
                                                borderBottomColor: "#ccc"
                                            }}
                                            onPress={() => {
                                                Constants.AppData.selectedVendorOrder = order;
                                                // navigation.navigate('DrawerRoutes', {
                                                //     screen: 'OrderDetailsScreen',
                                                // });
                                                navigation.push('VendorsOrderDetailsScreen')
                                            }}
                                            key={Math.random()}>
                                            <View
                                                style={{
                                                    height: 180,
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between', marginHorizontal: 10,
                                                    width: "100%",
                                                    alignSelf: 'center',
                                                    paddingVertical:10
                                                }}>

                                                <View style={{ flex: 4, height: "100%", justifyContent: "space-evenly" }}>
                                                    <Text style={{ fontSize: 20, color: "#000", marginLeft: 0, paddingTop: 5 }}>{order.shopName}</Text>
                                                    <Text style={{ fontSize: 14, color: "#000", marginLeft: 0, paddingTop: 5 }}>{order.orderId}</Text>
                                                    <Text style={{ fontSize: 16, paddingTop: 5 }}>{Constants.getTimeStr(order.milliseconds)}</Text>
                                                    <Text style={{ fontSize: 16, paddingTop: 5 }}>Order Amount ₹{order.price}</Text>
                                                    <Text style={{ fontSize: 16, paddingTop: 5 }}>Delievery Charge ₹{order.delieveryPrice}</Text>
                                                    <Text style={{ fontSize: 16, paddingTop: 5 }}>Total ₹{(order.price + order.delieveryPrice)}</Text>
                                                    <Text style={{ fontSize: 16, paddingTop: 5 }}>Order Status {": " + order.status}</Text>
                                                    <Text style={{ fontSize: 16, paddingTop: 5 }}>Phone : {order.phone}</Text>
                                                    <Text style={{ fontSize: 16, paddingTop: 5 }}>Address : {order.address}</Text>
                                                    <Text style={{ fontSize: 16, paddingTop: 5 }}>Payment Mode : {order.paymentType}</Text>
                                                    <Text style={{ fontSize: 16, paddingTop: 5 }}>Shipping Slot : {order.shippingSlot}</Text>
                                                </View>
                                            </View>
                                        </Ripple>
                                    )
                                })
                            }


                        </View>
                    ) : (<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Feather
                            name='gift'
                            style={{ fontSize: 80, color: "red" }}
                        />
                        <Text style={{ fontSize: 25 }}>No Percel is assigned you yet</Text>
                        <Text style={{ fontSize: 18 }}>Assigned items will show up here</Text>

                    </View>)}
                </ScrollView>
            </View>
        </>
    );
};

export default VendorDeliveredOrders;

const styles = StyleSheet.create({});
