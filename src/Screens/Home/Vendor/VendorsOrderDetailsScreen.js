import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, Alert, ActivityIndicator } from 'react-native'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import * as Constants from '../../../Constants'
import { useIsFocused } from "@react-navigation/native";
import database from "@react-native-firebase/database";
import Feather from 'react-native-vector-icons/Feather';
import { Provider as PaperProviderProd } from 'react-native-paper';
import Ripple from 'react-native-material-ripple';

const VendorsOrderDetailsScreen = ({ navigation, }) => {
    let OrderDetail = Constants.AppData.selectedVendorOrder;
    const isFocused = useIsFocused();
    const [updateUi, setUpdateUi] = useState("")
    const [isprocessing, setIsprocessing] = useState(false)
    const ChangeStatus = (status) => {
        database()
          .ref(`order/${OrderDetail.dbukey}/${OrderDetail.dbokey}`)
          .update({ status })
          .then(() => {
            OrderDetail.status = status;
            setUpdateUi(Math.random())
          });
      };
    return (
        <PaperProviderProd style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
                <View style={{
                    justifyContent: "center", width: "100%",
                    alignItems: "center"
                }}>
                    <Text style={{ fontSize: 20, color: "#000" }}>{OrderDetail.shopName}</Text>
                    <Text style={{ fontSize: 16, color: "#000" }}>{OrderDetail.orderId}</Text>

                    <View style={{
                        flexDirection: "row", justifyContent: "space-between",
                        width: "100%",
                        paddingVertical: 2,
                        paddingHorizontal: 20,
                        alignItems: "center"
                    }}>
                        <Text style={{}}>{OrderDetail.product.length + " "}item(s)</Text>
                        <Text style={{}}>{Constants.getTimeStr(OrderDetail.milliseconds)}</Text>

                    </View>
                    <View style={{
                        flexDirection: "row", justifyContent: "space-between",
                        width: "100%",
                        paddingVertical: 2,
                        paddingHorizontal: 20,
                        alignItems: "center"
                    }}>
                        <Text style={{}}>Order Status: {OrderDetail.status}</Text>
                        <Text style={{ }}>Delievery Charge ₹{OrderDetail.delieveryPrice}</Text>

                    </View>
                    <View style={{
                        flexDirection: "row", justifyContent: "space-between",
                        width: "100%",
                        paddingVertical: 2,
                        paddingHorizontal: 20,
                        alignItems: "center"
                    }}>
                        <Text style={{}}>Order Amount ₹{OrderDetail.price}</Text>
                        <Text style={{color:"#000", fontSize:18}}>Total ₹{(OrderDetail.price + OrderDetail.delieveryPrice)}</Text>

                    </View>
                </View>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={[{ flex: 1 }]}>
                    <View style={{ flex: 1, paddingHorizontal: 5, marginBottom: 65 }}>

                        {
                            OrderDetail.product.map((product) => {

                                return (
                                    <View key={Math.random()}
                                        style={{
                                            height: 90,
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
                                                {product.url ? (
                                                    <Image
                                                        source={{ uri: product.url }}
                                                        style={{ width: 60, height: 60, marginLeft: 10, resizeMode: 'cover' }}></Image>
                                                ) : (
                                                    <Image
                                                        source={Constants.localImages.productNotFound}
                                                        style={{ width: 60, height: 60, marginLeft: 10, resizeMode: 'cover' }}></Image>
                                                )}

                                            </View>
                                        </View>
                                        <View style={{ flex: 4, height: "100%", justifyContent: "space-evenly" }}>
                                            <Text style={{ fontSize: 20, color: "#000", marginLeft: 0, }}>{product.productName}</Text>
                                            <Text>Price:₹{product.price + "/" + product.prefix}</Text>
                                            <Text>Quantity:{product.quantity.label}</Text>
                                            <Text>Amount:₹{product.price * product.quantity.quantity}</Text>
                                        </View>
                                    </View>
                                )
                            })
                        }
                        {isprocessing ? (<ActivityIndicator color={"#000"} />) : (
                            <>
                                {(OrderDetail.status == "cancelled" || OrderDetail.status == "delievered") ? (<></>) : (

                                    <Ripple
                                        style={{
                                            backgroundColor: "#000",
                                            width: 200, height: 50,
                                            borderRadius: 5,
                                            marginTop: 7,
                                            alignSelf: "center",
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }} onPress={() => {
                                            Alert.alert(
                                                "Are your sure?",
                                                "Are you sure you want to mark it as delievered?",
                                                [
                                                    { text: "Yes", onPress: () => { ChangeStatus("delievered") }, },
                                                    { text: "No", },
                                                ]
                                            );
                                        }}>
                                        <Text style={{ color: "#fff", fontSize: 18 }}>Mark delievered</Text>
                                    </Ripple>
                                )}
                                {(OrderDetail.status == "cancelled" || OrderDetail.status == "delievered") ? (<></>) : (

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
                                                "Are you sure you want to mark it as cancelled?",
                                                [
                                                    { text: "Yes", onPress: () => { ChangeStatus("cancelled") }, },
                                                    { text: "No", },
                                                ]
                                            );
                                        }}>
                                        <Text style={{ color: "#fff", fontSize: 18 }}>Mark cancelled</Text>
                                    </Ripple>
                                )}
                            </>
                        )}

                    </View>

                </ScrollView>
            </View>
        </PaperProviderProd>
    );
};

export default VendorsOrderDetailsScreen;

const styles = StyleSheet.create({});
