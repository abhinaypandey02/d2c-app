import {ActivityIndicator, Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import * as Constants from '../../Constants/index'
import Feather from 'react-native-vector-icons/Feather';
import Ripple from 'react-native-material-ripple';
import openMap from "react-native-open-maps";
import {useDispatch, useSelector} from "react-redux";
import { FloatingAction } from "react-native-floating-action";
import {reload} from "../../../App";

const getB2BOrderUser = (userlist,searchStr)=>{
    let res=null;
    Object.keys(userlist).map((uid) => {
        if (userlist[uid].phone&&userlist[uid].phone.toString() === searchStr.toString()) {
            res= ({...userlist[uid].details,phone:userlist[uid].phone});
        }
    })
    return res;
}
const getCusomerUser = (userlist,searchStr)=>{
    let res=null;
    Object.keys(userlist).map((uid) => {
        if (userlist[uid].phone&&userlist[uid].phone.toString() === searchStr.toString()) {
            res = userlist[uid];
        }
    });
    return res;
}
const HomeScreen = ({navigation}) => {
    const user=useSelector(state=>state.user);
    const d2cOrders=useSelector(state=>state.d2cOrders);
    const b2bOrders=useSelector(state=>state.b2bOrders);
    const customers=useSelector(state=>state.customers);
    const config=useSelector(state=>state.config);
    const b2bUsers=useSelector(state=>state.b2bUsers);
    const [pending,setPending]=useState(null);
    const [completed,setCompleted]=useState(null);
    const [cod,setCOD]=useState(null);
    const [filter,setFilter]=useState("Dispatched");
    const [collected, setCollected] = useState(0)
    let ordersToShow=null;
    switch (filter){
        case "Dispatched": {
            ordersToShow = pending;
            break;
        }
        case "Delivered": {
            ordersToShow = completed
            break;
        }
        case "COD":{
            ordersToShow=cod;
            break;
        }
    }
    function openLink(url){
        Linking.openURL(url);

    }
    useEffect(() => {
        if(!user||!d2cOrders||!b2bOrders) return;
        let collected2=0;
        const cod2=[];
        if(user.money) Object.keys(user.money).forEach(k=>{
            if(user.money[k].collected) {
                let o=d2cOrders.find(ok=>ok.orderid===k);
                if(!o) o =b2bOrders.find(ok=>ok.accessKey===k)
                if(o&&(o.status==="Delivered"||o.status==="delievered")){
                    if(!o.paymentType||o.paymentType==="COD")cod2.push(o);
                    collected2 += user.money[k].collected
                    if(user.money[k].submitted) collected2-=user.money[k].submitted;
                }
            }
        })
        setCOD([...cod2]);
        setCollected(collected2)
    }, [user,d2cOrders,b2bOrders])
    useEffect(()=>{
        let pendingOrders=[],completedOrders=[];

        function sortComp(a,b){
            let aCheck,bCheck;
            if(a.milliseconds) aCheck=a.milliseconds;
            if(a.createdAt) aCheck=a.createdAt;
            if(b.milliseconds) bCheck=b.milliseconds;
            if(b.createdAt) bCheck=b.createdAt;
            return bCheck-aCheck
        }

        if(d2cOrders){
            pendingOrders=d2cOrders.filter(o=>o.status==="Dispatched"||o.status==="Pendding").sort((a,b)=>b.createdAt-a.createdAt);
            completedOrders=d2cOrders.filter(o=>o.status==="Delivered").sort((a,b)=>b.createdAt-a.createdAt);
        }
        if(b2bOrders){
            pendingOrders=[...pendingOrders,...b2bOrders.filter(o=>o.status==="processed"||o.status==="pending"||o.status==="dispatched")];
            completedOrders=[...completedOrders,...b2bOrders.filter(o=>o.status==="delievered")]
        }
        setPending(pendingOrders.sort(sortComp));

        setCompleted(completedOrders.sort(sortComp));
    },[d2cOrders,filter,b2bOrders])
    return (
        <View style={{flex: 1, backgroundColor: '#ffffff'}}>
            {config.loadingProgress>0&&<Text style={{backgroundColor:"#fffb0c",textAlign:"center",marginVertical:5,paddingVertical:5,color:"#444444"}}>Reloading {config.loadingProgress}%</Text>}
            <View style={{marginHorizontal:20,marginVertical:10}}>
                <TouchableOpacity onPress={()=>navigation.navigate("ProfileScreen")} style={{display:"flex",flexDirection:"row",alignItems:"center"}}>
                    <Feather
                        name="user"
                        style={{
                            fontSize: 23,
                            color: "black",
                            textAlign: 'center',
                        }}
                    />
                    <Text style={{flexGrow:1,color:"black",fontSize:18,marginHorizontal:5}}>{user.name}</Text>
                </TouchableOpacity>
            </View>
            <View style={{display: "flex", flexDirection: "row", justifyContent: "space-around",padding:10}}>
                <View style={{borderRadius: 10, backgroundColor: "orange",flexGrow:1, margin: 10}}>
                    <Text style={{color: "white", fontSize: 18, padding: 10}}>Money Collected</Text>
                    <Text style={{color: "white", fontSize: 18, padding: 10}}>{collected}</Text>
                </View>
                <View style={{borderRadius: 10, backgroundColor: "green",flexGrow:1, margin: 10}}>
                    <Text style={{color: "white", fontSize: 18, padding: 10}}>Money Earned</Text>
                    <Text style={{color: "white", fontSize: 18, padding: 10}}>{completed&&completed.length*config.deliveryEarnings}</Text>
                </View>
            </View>
            {!ordersToShow && (<ActivityIndicator color={"#000"}/>)}
            <View style={{backgroundColor: "#d9d9d9",flex:1}}>

                <View style={{display:"flex",flexDirection:"row",justifyContent:"space-around",height:40,marginVertical:10}}>
                    <Ripple style={{padding:7,backgroundColor:("Dispatched"===filter?"aqua":"white"),borderRadius:5,borderColor:"black",alignItems:"center",justifyContent:"center"}} onPress={()=>setFilter("Dispatched")}>
                        <Text style={{color:"black"}}>Pending {pending&&`(${pending.length})`}</Text>
                    </Ripple>
                    <Ripple style={{padding:7,backgroundColor:("Delivered"===filter?"aqua":"white"),borderRadius:5,borderColor:"black",alignItems:"center",justifyContent:"center"}} onPress={()=>setFilter("Delivered")}>
                        <Text style={{color:"black"}}>Delivered {completed&&`(${completed.length})`}</Text>
                    </Ripple>
                    <Ripple style={{padding:7,backgroundColor:("COD"===filter?"aqua":"white"),borderRadius:5,borderColor:"black",alignItems:"center",justifyContent:"center"}} onPress={()=>setFilter("COD")}>
                        <Text style={{color:"black"}}>COD {cod&&`(${cod.length})`}</Text>
                    </Ripple>
                </View>

                {ordersToShow&&ordersToShow.length > 0 &&
                    <ScrollView contentContainerStyle={{paddingHorizontal: 5,flexGrow:1,justifyContent: "flex-start"}}>
                        {
                            ordersToShow.map((order) => {
                                var userDetails;
                                let orderID=order.orderid;
                                if(order.orderId) orderID=order.orderId;
                                if(order.userid) userDetails = getCusomerUser(customers, order.userid);
                                if(order.phone) userDetails = getB2BOrderUser(b2bUsers, order.phone);
                                let dc=0;
                                if(order.delieveryPrice) dc=parseInt(order.delieveryPrice);
                                let price=0,paymentType="COD";
                                if(order.totalAmount)price=order.totalAmount
                                if(order.price)price=order.price;
                                if(order.paymentType)paymentType=order.paymentType;
                                let address;
                                if(order.address) address=order.address
                                else if(userDetails){
                                    if(userDetails.address) address=userDetails.address
                                    else if(userDetails.shopAddress) address=userDetails.shopAddress
                                    else {

                                    }
                                }
                                return (
                                    <View key={Math.random()} style={{
                                        display:"flex",
                                        height:230,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        margin: 10,
                                        paddingVertical: 10,
                                        paddingHorizontal: 20,
                                        backgroundColor: "white",
                                        borderRadius: 10,

                                    }}>
                                        <Ripple

                                            style={{
                                                flexGrow: 1,

                                            }}
                                            onPress={() => {
                                                Constants.AppData.selectedOrder = order;
                                                navigation.push('OrderDetailsScreen')
                                            }}>
                                            <View
                                                style={{maxWidth:"90%"}}>
                                                {orderID&&<Text style={styles.text}>Order No: {orderID.slice(0,15)}{orderID.length>15&&"..."}</Text>}
                                                <Text style={styles.text}>Shop Name: {userDetails&&userDetails.name?userDetails.name:order.shopName}</Text>
                                                <Text style={styles.text}>Phone: {userDetails&&userDetails.phone?userDetails.phone:order.phone}</Text>
                                                {address&&<Text style={styles.text}>Address: {address}</Text>}
                                                {order.sector&&<Text style={styles.text}>Sector: {order.sector}</Text>}
                                                {order.houseNo&&<Text style={styles.text}>House No.: {order.houseNo}</Text>}
                                                {order.pincode&&<Text style={styles.text}>Pincode: {order.pincode}</Text>}
                                                <Text style={styles.text}>No. of items: {order.products?order.products.length:order.product.length}</Text>
                                                <Text style={styles.text}>{(paymentType==="COD"?"Cash":"Paid")}: {price}</Text>
                                                {dc>0&&<Text style={styles.text}>Delivery: {dc}</Text>}
                                                <Text style={styles.text}>Total: {price+dc}</Text>

                                            </View>
                                        </Ripple>
                                        <Ripple style={{
                                            height: "100%",
                                            padding:5,
                                            justifyContent: "center",
                                            flexShrink:0
                                        }} onPress={() => {
                                            if (userDetails&&userDetails.locationLink) {
                                                openLink(userDetails.locationLink)
                                                return;
                                            }
                                            if(address) openLink("https://maps.google.com/?daddr="+encodeURIComponent(address.toString().replaceAll(' ','+')));
                                            else if (userDetails&&userDetails.location) openMap(userDetails.location)
                                            else Alert.alert("Location not found!", "This shop has not added there location till now.")
                                        }}>
                                            <Feather
                                                name="map-pin"
                                                style={{
                                                    fontSize: 23,
                                                    color: "black",
                                                    textAlign: 'center',
                                                }}
                                            />
                                        </Ripple>
                                    </View>

                                )
                            })
                        }


                    </ScrollView>
                 }
                {ordersToShow&&ordersToShow.length===0&&<View style={{marginVertical:50,alignItems:"center"}}>
                    <Feather
                        name='gift'
                        style={{fontSize: 80, color: "red"}}
                    />
                    <Text style={{fontSize: 25,color:"black"}}>No Percel is assigned you yet</Text>
                    <Text style={{fontSize: 18,color:"black"}}>Assigned items will show up here</Text>

                </View>}

            </View>
            <FloatingAction
                overrideWithAction={true}
                actions={[{
                    text: "Reload",
                    icon: <Feather name="rotate-ccw" style={{fontSize:23}}/>,
                    name: "reload",
                    position: 1
                }]}
                onPressItem={reload}
            />
        </View>

    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    text: {fontSize: 14, color: "#000", marginLeft: 0, width: "100%"}
});
