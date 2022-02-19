import { StyleSheet, Text, View,ScrollView ,Image, ActivityIndicator} from 'react-native';
import React, { useState, useEffect } from 'react';
import * as Constants from '../../Constants/index'
import { useIsFocused } from "@react-navigation/native";
import database from "@react-native-firebase/database";
import Feather from 'react-native-vector-icons/Feather';
import { Provider as PaperProviderProd } from 'react-native-paper';
import Ripple from 'react-native-material-ripple';
import openMap from 'react-native-open-maps';
import Footer from "../../Components/Footer";
const DeliveredOrders = ({navigation}) => {
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
        .ref(Constants.dbpath.order)
        .once('value')
        .then(snapshot => {
          let data = snapshot.val();
          if (data) {
            let orderz = []
            Object.keys(data).map((userid) => {
              Object.keys(data[userid]).map((oid) => {
                if (getLastUser(data[userid][oid].deliveryBoyIDs || []).userid === deliverBoyUserid) {
                  if(data[userid][oid].status == "Delivered")
                  orderz.push(data[userid][oid])
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

  }
  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <View style={{
          justifyContent: "center", width: "100%",
          alignItems: "center",
          borderBottomColor:Constants.colorCode.liteGray,
          borderBottomWidth:1,
          paddingBottom:20
        }}>
          <Text style={{ fontSize: 20, color: "#000" }}>Completed Deliveries</Text>
        </View>
        {isDataLoading && (<ActivityIndicator color={"#000"} />)}
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={[{ flex: 1 }]}>
          {orderItems.length > 0 ? (
            <View style={{ flex: 1, paddingHorizontal: 5, marginBottom: 65, justifyContent: "flex-start" }}>
              {
                orderItems.map((order) => {
                  let image = Constants.getImages(order.products[0].images)[0];
                  let userDetails = Constants.getCusomerUser(Constants.AppData.customers,order.userid)
                  return (
                    <Ripple
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: "#ccc"
                    }}
                      onPress={() => {
                        Constants.AppData.selectedOrder = order;
                        // navigation.navigate('DrawerRoutes', {
                        //     screen: 'OrderDetailsScreen',
                        // });
                        navigation.push('OrderDetailsScreen')
                      }}
                      key={Math.random()}>
                      <View
                        style={{
                          height: 80,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between', marginHorizontal: 10,
                          width: "100%",
                          alignSelf: 'center',
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
                          <Text style={{ fontSize: 20, color: "#000", marginLeft: 0, }}>{order.orderid}</Text>
                          <Text style={{ fontSize: 20, color: "#000", marginLeft: 0, }}>₹{order.totalAmount}</Text>
                          <Text style={{ fontSize: 20, color: "#000", marginLeft: 0, }}>{Constants.getTimeStr(order.createdAt)}</Text>
                          <Text style={{ fontSize: 20, color: "#000", marginLeft: 0, }}>Order Status {": " + order.status}</Text>
                        </View>
                      </View>

                      <View style={{ flex: 3, height: "100%", justifyContent: "space-evenly" }}>
                          <Text style={{ fontSize: 20, color: "#000", marginLeft: 0, }}>Name {userDetails.name}</Text>
                          <Text style={{ fontSize: 20, color: "#000", marginLeft: 0, }}>Phone : {userDetails.phone}</Text>
                          <Text style={{ fontSize: 20, color: "#000", marginLeft: 0, }}>Address : {userDetails.address}</Text>
                          <Text style={{ fontSize: 20, color: "#000", marginLeft: 0, }}>Landmark : {userDetails.landmark}</Text>
                          <Text style={{ fontSize: 20, color: "#000", marginLeft: 0, }}> Pincode : {userDetails.pincode}</Text>
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
        <Footer navigation={navigation} />

      </View>
    </>
  );
};

export default DeliveredOrders;

const styles = StyleSheet.create({});
