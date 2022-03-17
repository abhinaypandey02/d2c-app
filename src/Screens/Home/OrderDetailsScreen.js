import React, {useEffect, useState} from 'react'
import {ActivityIndicator, Image, StyleSheet, Text, View} from 'react-native'
import {ScrollView} from 'react-native-gesture-handler'
import * as Constants from '../../Constants'
import {useIsFocused} from "@react-navigation/native";
import database from "@react-native-firebase/database";
import {Provider as PaperProviderProd} from 'react-native-paper';
import Ripple from 'react-native-material-ripple';
import openMap from "react-native-open-maps";

const OrderDetailsScreen = ({navigation,}) => {
    let OrderDetail = Constants.AppData.selectedOrder;
    let userDetails = Constants.getCusomerUser(Constants.AppData.customers, OrderDetail.userid)
    let Units = Constants.AppData.units;
    const isFocused = useIsFocused();
    const [updateUi, setUpdateUi] = useState("")
    const [isprocessing, setIsprocessing] = useState(false)

    useEffect(() => {
        setUpdateUi(Math.random())
    }, [isFocused]);
    const [update, setUpdate] = useState("123")
    const markDeliverleOrder = () => {
        navigation.navigate("ConfirmOrder")

    };
    const markCanceledOrder = () => {
        setIsprocessing(true)
        let ostat = OrderDetail.orderStatus;
        let dt = new Date()
        ostat.push({
            time: dt.getTime(),
            status: "Canceled",
            msg: "Order delivered by " + Constants.AppData.user.name,
            deliveryDate: dt.getTime()
        })
        OrderDetail.status = "Canceled";
        database()
            .ref(`${Constants.dbpath.order}/${OrderDetail.userid}/${OrderDetail.orderid}`)
            .update(OrderDetail)
            .then(() => {
                setUpdate(Math.random())
                setIsprocessing(false)
            });
    };
    return (
        <PaperProviderProd style={{flex: 1}}>

            <View style={{flex: 1, backgroundColor: '#ffffff'}}>
                {userDetails && userDetails.location &&
                    <Ripple style={{margin: 10, backgroundColor: "#c9c9c9", padding: 20}}
                            onPress={() => openMap(userDetails.location)}><Text
                        style={{fontSize: 20, color: "#000", marginLeft: 0, textAlign: "center"}}>Google
                        Map</Text></Ripple>}
                <View style={{
                    justifyContent: "center", width: "100%",
                    alignItems: "center"
                }}>
                    <Text style={styles.text}>{OrderDetail.orderid ? OrderDetail.orderid : OrderDetail.orderId}</Text>
                    <Text
                        style={styles.text}>{OrderDetail.products ? OrderDetail.products.length : OrderDetail.product.length + " "}item(s)</Text>
                    <Text
                        style={styles.text}>{Constants.getTimeStr(OrderDetail.createdAt ? OrderDetail.createdAt : OrderDetail.milliseconds)}</Text>
                    <Text style={styles.text}>{OrderDetail.status}</Text>
                </View>
                <ScrollView contentContainerStyle={{flexGrow: 1}} style={[{flex: 1}]}>
                    <View style={{flex: 1, paddingHorizontal: 5, marginBottom: 65}}>
                        <View style={{
                            flexDirection: "row", justifyContent: "space-between",
                            borderBottomColor: "#ccc",
                            borderBottomWidth: 1,
                            paddingVertical: 5,
                            alignItems: "center"
                        }}>

                            <Text style={{fontSize: 20,color:"black"}}>Total</Text>
                            <Text style={{
                                fontSize: 24,
                                color: "#000"
                            }}>₹{OrderDetail.totalAmount ? OrderDetail.totalAmount : OrderDetail.price}</Text>
                        </View>
                        {(() => {
                            const p = OrderDetail.products ? OrderDetail.products : OrderDetail.product
                            return p.map((product) => {
                                let image, price = product.price, prefix=product.prefix, quantity=product.quantity;
                                if (product.price[0].amount) price = product.price[0].amount
                                if (product.images) image = Constants.getImages(product.images)[0];
                                if (product.url) image = {url:product.url}
                                if(Units[product.price[0].unitid]) prefix=Units[product.price[0].unitid].title
                                if(quantity.quantity) quantity=quantity.quantity
                                return (
                                    <View key={Math.random()}
                                          style={{
                                              height: 140,
                                              marginTop: 5,
                                              flexDirection: 'row',
                                              alignItems: 'center',
                                              justifyContent: 'space-between', marginHorizontal: 10,
                                              width: "100%",
                                              alignSelf: 'center',
                                              borderBottomWidth: 1,
                                              borderBottomColor: "#ccc"
                                          }}>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: "center",
                                            flex: 1.2,
                                        }}>
                                            <Image
                                                source={image?{uri: image.url}:Constants.localImages.productNotFound}
                                                style={{
                                                    width: 60,
                                                    height: 60,
                                                    marginLeft: 10,
                                                    resizeMode: 'cover'
                                                }}/>
                                        </View>
                                        <View style={{flex: 3, height: "100%", justifyContent: "space-evenly"}}>
                                            <Text style={styles.productStyle}>{product.title ? product.title : product.productName}</Text>
                                            <Text style={styles.productStyle}>Price:₹{price + "/" + prefix}</Text>
                                            <Text style={styles.productStyle}>Quantity:{quantity} {prefix}</Text>
                                            <Text style={styles.productStyle}>Amount:₹{parseInt(price) * quantity}</Text>
                                        </View>
                                    </View>
                                )
                            })
                        })()

                        }
                        {isprocessing ? (<ActivityIndicator color={"#000"}/>) : (
                            <>
                                {(!["Canceled", "cancelled", "delievered", "Delivered"].includes(OrderDetail.status)) && (

                                    <Ripple
                                        style={{
                                            backgroundColor: "#000",
                                            width: 200, height: 50,
                                            borderRadius: 5,
                                            marginTop: 7,
                                            alignSelf: "center",
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }} onPress={markDeliverleOrder}>
                                        <Text style={{color: "#fff", fontSize: 18}}>Mark Delivered</Text>
                                    </Ripple>
                                )}
                            </>
                        )}

                    </View>

                </ScrollView>
            </View>
        </PaperProviderProd>
    )
}

export default OrderDetailsScreen

const styles = StyleSheet.create({
    productStyle:{
        fontSize: 20,
        color: "#000",
        marginLeft: 0,
        marginVertical:10
    },
    text: {fontSize: 27, color: "#000", fontWeight: "bold", marginVertical: 10, textAlign: "center"}
})
