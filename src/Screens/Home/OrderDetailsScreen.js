import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, Alert, ActivityIndicator } from 'react-native'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import Footer from '../../Components/Footer'
import Template from '../../Components/Template'
import * as Constants from '../../Constants'
import { useIsFocused } from "@react-navigation/native";
import database from "@react-native-firebase/database";
import Feather from 'react-native-vector-icons/Feather';
import { Provider as PaperProviderProd } from 'react-native-paper';
import Ripple from 'react-native-material-ripple';
import openMap from "react-native-open-maps";

const OrderDetailsScreen = ({ navigation, }) => {
    let OrderDetail = Constants.AppData.selectedOrder;
    let userDetails = Constants.getCusomerUser(Constants.AppData.customers,OrderDetail.userid)
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
        ostat.push({ time: dt.getTime(), status: "Canceled", msg: "Order delivered by " + Constants.AppData.user.name, deliveryDate: dt.getTime() })
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
        <PaperProviderProd style={{ flex: 1 }}>

            <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
                {userDetails.location&&<Ripple style={{margin:10,backgroundColor:"#c9c9c9",padding:20}} onPress={()=>openMap(userDetails.location)}><Text style={{ fontSize: 20, color: "#000", marginLeft: 0, textAlign:"center"}}>Google Map</Text></Ripple>}
                <View style={{
                    justifyContent: "center", width: "100%",
                    alignItems: "center"
                }}>
                    <Text style={styles.text}>{OrderDetail.orderid}</Text>
                    <Text style={styles.text}>{OrderDetail.products.length + " "}item(s)</Text>
                    <Text style={styles.text}>{Constants.getTimeStr(OrderDetail.createdAt)}</Text>
                    <Text style={styles.text}>{OrderDetail.status}</Text>
                </View>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={[{ flex: 1 }]}>
                    <View style={{ flex: 1, paddingHorizontal: 5, marginBottom: 65 }}>
                        <View style={{
                            flexDirection: "row", justifyContent: "space-between",
                            borderBottomColor: "#ccc",
                            borderBottomWidth: 1,
                            paddingVertical: 5,
                            alignItems: "center"
                        }}>

                            <Text style={{ fontSize: 20 }}>Total</Text>
                            <Text style={{ fontSize: 24, color: "#000" }}>₹{OrderDetail.totalAmount}</Text>
                        </View>
                        {
                            OrderDetail.products.map((product) => {
                                let image = Constants.getImages(product.images)[0];
                                return (
                                    <View key={Math.random()}
                                        style={{
                                            height: 80,
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
                                            <View style={{ width: 60, height: 60, }}>
                                                {image ? (
                                                    <Image
                                                        source={{ uri: image.url }}
                                                        style={{ width: 60, height: 60, marginLeft: 10, resizeMode: 'cover' }}></Image>
                                                ) : (
                                                    <Image
                                                        source={Constants.localImages.productNotFound}
                                                        style={{ width: 60, height: 60, marginLeft: 10, resizeMode: 'cover' }}></Image>
                                                )}

                                            </View>
                                        </View>
                                        <View style={{ flex: 3, height: "100%", justifyContent: "space-evenly" }}>
                                            <Text style={{ fontSize: 20, color: "#000", marginLeft: 0, }}>{product.title}</Text>
                                            <Text>Price:₹{product.price[0].amount + "/" + Units[product.price[0].unitid].title}</Text>
                                            <Text>Quantity:{product.quantity} {Units[product.price[0].unitid].title}</Text>
                                            <Text>Amount:₹{product.price[0].amount * product.quantity}</Text>
                                        </View>
                                        <View style={{ flex: 1, height: "100%" }}>


                                        </View>
                                    </View>
                                )
                            })
                        }
                        {isprocessing ? (<ActivityIndicator color={"#000"} />) : (
                            <>
                                {(OrderDetail.status == "Canceled" || OrderDetail.status == "Delivered") ? (<></>) : (

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
                                        <Text style={{ color: "#fff", fontSize: 18 }}>Mark Delivered</Text>
                                    </Ripple>
                                )}
                                {(OrderDetail.status == "Canceled" || OrderDetail.status == "Delivered") ? (<></>) : (

                                    <Ripple
                                        style={{
                                            backgroundColor: "#f00",
                                            width: 200, height: 50,
                                            borderRadius: 5,
                                            marginTop: 10,
                                            alignSelf: "center",
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }} onPress={() => {
                                            Alert.alert(
                                                "Are your sure?",
                                                "Are you sure you want to mark it as Canceled?",
                                                [
                                                    { text: "Yes", onPress: () => { markCanceledOrder() }, },
                                                    { text: "No", },
                                                ]
                                            );
                                        }}>
                                        <Text style={{ color: "#fff", fontSize: 18 }}>Mark Canceled</Text>
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

    text:{ fontSize: 27, color:"#000", fontWeight:"bold", marginVertical:10, textAlign:"center" }
})
