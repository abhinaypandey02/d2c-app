import {Alert, Text, TextInput, View} from "react-native";
import * as Constants from "../../Constants";
import database from "@react-native-firebase/database";
import React, {useState} from "react";
import auth from "@react-native-firebase/auth";
import Ripple from "react-native-material-ripple";

export default function ConfirmOrder({navigation}){
    const [collected,setCollected]=useState(0)
    let OrderDetail = {...Constants.AppData.selectedOrder};
    async function orderDelivered(){
        let ostat = {...OrderDetail.orderStatus};
        let dt = new Date()
        OrderDetail.status = "Delivered";
        OrderDetail.orderStatus[Object.keys(ostat).length.toString()]={ time: dt.getTime(), status: "Delivered", msg: "Order delivered by " + Constants.AppData.user.name, deliveryDate: dt.getTime() }
        const snap=await database().ref("deliveryEarnings/d2c").once("value");

        const charge=snap.val()
        await database()
            .ref(`${Constants.dbpath.order}/${OrderDetail.userid}/${OrderDetail.orderid}`)
            .update(OrderDetail)

        await database().ref(`${Constants.dbpath.user}/${auth().currentUser.uid}/money/${OrderDetail.orderid}`).update({collected,earned:charge,type:"d2c"})
        navigation.reset({index: 0, routes: [{name: "HomeScreen"}]})
    }
    return <View style={{padding:15}}>
        <Text style={{color:"black"}}>Money Collected</Text>
        <TextInput style={{color:"black",borderColor:"black",borderWidth:2,padding:10,margin:10}} placeholder={"Money Collected"} placeholderTextColor={"#686868"} onChangeText={e=> {
            if(e==='') setCollected(0)
            else setCollected(parseInt(e))
        }} value={collected.toString()} keyboardType="numeric"/>
        <Ripple style={{margin:10,backgroundColor:"red",padding:20}} onPress={()=>{
            Alert.alert(
                "Are your sure?",
                "Are you sure you want to mark it as Delivered?",
                [
                    { text: "Yes", onPress: orderDelivered },
                    { text: "No", },
                ]
            );}
        }><Text style={{ fontSize: 20, color: "#000", marginLeft: 0, textAlign:"center"}}>Complete</Text></Ripple>

    </View>
}
