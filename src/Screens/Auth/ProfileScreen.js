import React from 'react'
import {Text, View} from 'react-native'
import * as Constants from '../../Constants'
import auth from "@react-native-firebase/auth";
import Ripple from 'react-native-material-ripple';
import {useDispatch, useSelector} from "react-redux";
import {reload} from "../../../App";
import * as ActionTypes from '../../Redux/ActionTypes';

const ProfileScreen = ({navigation}) => {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch();
    const Logout = async () => {
        await auth().signOut()
        dispatch({
            type: ActionTypes.CLEAR_CURRENT_USER
        })
        navigation.reset({index: 0, routes: [{name: 'LoginScreen'}],});

        reload();
        console.log(user)
    };
    return (<View style={{flex: 1, marginVertical: 40}}>
        <Text style={{fontSize: 23, color: "#000", fontWeight: "bold", marginHorizontal: 30}}>Name</Text>
        <Text style={{
            fontSize: 23, color: "#000", fontWeight: "400", marginHorizontal: 30
        }}>{user.name} {user.lastName}</Text>
        <Text style={{fontSize: 23, color: "#000", fontWeight: "bold", marginHorizontal: 30}}>Current Address</Text>
        <Text style={{
            fontSize: 23, color: "#000", fontWeight: "400", marginHorizontal: 30
        }}>{user.address} {user.address2}</Text>
        {user.state && <>
            <Text style={{fontSize: 23, color: "#000", fontWeight: "bold", marginHorizontal: 30}}>State</Text>
            <Text style={{
                fontSize: 23, color: "#000", fontWeight: "400", marginHorizontal: 30
            }}>{user.state}</Text>
        </>}
        {user.landmark && <>
            <Text style={{fontSize: 23, color: "#000", fontWeight: "bold", marginHorizontal: 30}}>Landmark</Text>
            <Text style={{
                fontSize: 23, color: "#000", fontWeight: "400", marginHorizontal: 30
            }}>{user.landmark}</Text>
        </>}
        {user.blockNo && <>
            <Text style={{fontSize: 23, color: "#000", fontWeight: "bold", marginHorizontal: 30}}>Block No.</Text>
            <Text style={{
                fontSize: 23, color: "#000", fontWeight: "400", marginHorizontal: 30
            }}>{user.blockNo}</Text>
        </>}

        <Ripple
            onPress={Logout}
            style={{
                width: 150,
                borderColor: "#000",
                padding: 5,
                margin: 30,
                borderRadius: 5,
                backgroundColor: Constants.colorCode.liteGray,
                borderWidth: 1
            }}>
            <Text style={{textAlign: "center", color: "black"}}>Logout</Text>
        </Ripple>
        <View style={{flex: 1}}/>
        <Text style={{fontSize: 19, color: "#000", fontWeight: "400", marginHorizontal: 20, textAlign: "center"}}>Support
            Contact: +91 9110514772</Text>

    </View>)
}

export default ProfileScreen
