import React, { useEffect, useState } from 'react'
import {StyleSheet, Text, View, Image, TextInput, Alert, ActivityIndicator, ScrollView} from 'react-native'
import Template from '../../Components/Template'
import * as Constants from '../../Constants'
import { useIsFocused } from "@react-navigation/native";
import AsyncStore from "@react-native-async-storage/async-storage";
import database from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Provider as PaperProviderProd } from 'react-native-paper';
import Ripple from 'react-native-material-ripple';
import Footer from "../../Components/Footer";

const ProfileScreen = ({ navigation }) => {
    const [phonenumber, setPhonenumber] = useState("")
    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [landmark, setLandmark] = useState('')
    const [pincode, setPincode] = useState('')
    const [address, setAddress] = useState('')
    const [address2, setAddress2] = useState('')
    const [blockNo, setBlockNo] = useState('')
    const [state, setState] = useState('')
    const [earned, setEarned] = useState(0)
    const [collected, setCollected] = useState(0)
    let navigateScreen = true;
    const focused = useIsFocused();
    useEffect(() => {
        auth().onAuthStateChanged((user) => {

            if (user) {
                let ph = user.phoneNumber.substring(3)
                setPhonenumber(ph)
                loadUsers(ph);
            } else {
                setPhonenumber("");
            }
        });
    }, [focused])
    const saveProfile = async (profieObj) => {
        await database()
            .ref(`${Constants.dbpath.user}/${auth().currentUser.uid}`)
            .update(profieObj)
        setUserState(profieObj)
        Constants.saveUser(profieObj)
    }
    const loadUsers = (phonumber) => {
        database()
            .ref(Constants.dbpath.user)
            .once('value')
            .then(snapshot => {
                let data = snapshot.val();
                let foundStat = false;
                if(data){
                    Constants.AppData.users = data;
                    Object.keys(data).map((uid) => {

                        if (data[uid].phone.toString() === phonumber.toString()) {
                            foundStat = true;
                            setUserState(data[uid])
                            Constants.saveUser(data[uid])
                        }
                    });
                }

                if (!foundStat) {
                    var dt = new Date();
                    let unique = Math.random().toString().substring(4, 6);
                    let unique2 = Math.random().toString().substring(4, 6);
                    let userid = unique + "" + dt.getTime() + "" + unique2;
                    let profieObj = {
                        userid,
                        phone: phonumber,
                        name,
                        email,
                        landmark,
                        pincode,
                        address2,
                        state,
                        blockNo,
                        address,
                        isVerified: false,
                        isBlocked: false,
                        isProfileComplete: false
                    };
                    navigateScreen = false;
                    saveProfile(profieObj)
                }
            });
    }

    const setUserState = (userObj) => {
        let collected2=0,earned2=0;
        if(userObj.money) Object.keys(userObj.money).forEach(k=>{
            if(userObj.money[k].earned) earned2+=userObj.money[k].earned
            if(userObj.money[k].collected) collected2+=userObj.money[k].collected
        })
            setName(userObj.name)
            setEmail(userObj.email)
            setPhonenumber(userObj.phone)
            setLandmark(userObj.landmark)
            setPincode(userObj.pincode)
            setAddress(userObj.address)
            setAddress2(userObj.address2)
            setLastName(userObj.lastName)
            setState(userObj.state)
            setBlockNo(userObj.blockNo)
            setEarned(earned2)
            setCollected(collected2)

    }

    const Logout = (callBack) => {
        auth()
            .signOut()
            .then(() => {
                Constants.clearStorageOnLogout();
                setPhonenumber("");
                setName("")
                setEmail("")
                setLandmark("")
                setPincode("")
                setAddress("")
            });
    };
    return (
            <View style={{height:"100%"}}>
                <View style={{display:"flex",flexDirection:"row",justifyContent:"space-around"}}>
                    <View style={{borderRadius:10,backgroundColor:"orange",width:"45%",margin:10}}>
                        <Text style={{color:"white",fontSize:18,padding:10}}>Money Collected</Text>
                        <Text style={{color:"white",fontSize:18,padding:10}}>{collected}</Text>
                    </View>
                    <View style={{borderRadius:10,backgroundColor:"green",width:"45%",margin:10}}>
                        <Text style={{color:"white",fontSize:18,padding:10}}>Money Earned</Text>
                        <Text style={{color:"white",fontSize:18,padding:10}}>{earned}</Text>
                    </View>
                </View>
                <Text style={{ fontSize: 23, color:"#000", fontWeight:"bold", marginHorizontal:30 }}>Name</Text>
                <Text style={{ fontSize: 23, color:"#000", fontWeight:"400", marginHorizontal:30 }}>{name}</Text>
                <Text style={{ fontSize: 23, color:"#000", fontWeight:"bold", marginHorizontal:30 }}>Current Address</Text>
                <Text style={{ fontSize: 23, color:"#000", fontWeight:"400", marginHorizontal:30 }}>{address} {address2}</Text>
                <Ripple
                    onPress={Logout}
                    style={{
                        width: 150, borderColor: "#000",
                        padding: 5,
                        margin:30,
                        borderRadius: 5,
                        backgroundColor: Constants.colorCode.liteGray,
                        borderWidth: 1
                    }}>
                    <Text style={{textAlign:"center",color:"black"}}>Logout</Text>
                </Ripple>
                <Footer navigation={navigation} />

            </View>


    )
}

export default ProfileScreen
