import React, { useEffect, useState } from 'react'
import {StyleSheet, Text, View, Image, TextInput, Alert, ActivityIndicator, ScrollView, Platform} from 'react-native'
import * as Constants from '../../Constants'
import { useIsFocused } from "@react-navigation/native";
import AsyncStore from "@react-native-async-storage/async-storage";
import database from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";
import {launchCamera} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import SelectDropdown from 'react-native-select-dropdown'
import Ripple from 'react-native-material-ripple';
import {useSelector} from "react-redux";
import {useForm} from "react-hook-form";
const LoginScreen = ({ navigation }) => {
    const user=useSelector(state=>state.user);
    const {control,handleSubmit}=useForm();
    console.warn(user);
    const [confirm, setConfirm] = React.useState(null);
    const [phonenumber, setPhonenumber] = useState("")
    const [otpCode, setOtpCode] = useState("")
    const [currentUI, setCurrentUI] = useState("LOADING")
    const [isprocessing, setIsprocessing] = useState(false)
    const [vehicleType, setVehicleType] = useState()
    const [name, setName] = useState('')
    const [rc, setRC] = useState(null);
    const [selfie, setSelfie] = useState(null);
    const [insurance, setInsurance] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [email, setEmail] = useState('')
    const [landmark, setLandmark] = useState('')
    const [pincode, setPincode] = useState('')
    const [address, setAddress] = useState('')
    const [address2, setAddress2] = useState('')
    const [blockNo, setBlockNo] = useState('')
    const [state, setState] = useState('')
    const [lastName, setLastName] = useState('')

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
                setCurrentUI("LOGIN")
            }
        });
    }, [focused])
    const selectImage = async (setImage,filename) => {
        const options = {
            maxWidth: 2000,
            maxHeight: 2000,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };
        const response=await launchCamera(options)
        if (response.didCancel) {
        } else if (response.errorCode) {
            console.log('ImagePicker Error: ', response.errorMessage);
        }  else {
            const source = { uri: response.assets[0].uri,filename  };
            setImage(source);

        }}
    const uploadImage = async (image) => {
        const { uri,filename } = image;
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        const task = storage()
            .ref(`images/${phonenumber}/`+filename);
        await task.putFile(uploadUri);
        try {
            await task;
        } catch (e) {
            console.error(e);
        }
        return await task.getDownloadURL();
    };
    const saveProfile = (profieObj) => {
        setIsprocessing(true)
        database()
            .ref(`${Constants.dbpath.user}/${auth().currentUser.uid}`)
            .update(profieObj)
            .then(() => {
                setUserState(profieObj)
                Constants.saveUser(profieObj)
            });
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
                        vehicleType,
                        landmark,
                        address2,
                        state,
                        blockNo,
                        lastName,
                        pincode,
                        address,
                        isVerified: false,
                        isBlocked: false,
                        isProfileComplete: false,
                        isApproved:false
                    };
                    navigateScreen = false;
                    saveProfile(profieObj)
                }
            });
    }

    const setUserState = (userObj) => {
        setName(userObj.name)
        setEmail(userObj.email)
        setPhonenumber(userObj.phone)
        setLandmark(userObj.landmark)
        setPincode(userObj.pincode)
        setAddress(userObj.address)
        setIsprocessing(false)
        setAddress2(userObj.address2)
        setState(userObj.state)
        setBlockNo(userObj.blockNo)
        setLastName(userObj.lastName)
        setVehicleType(userObj.vehicleType)
        if(!userObj.isBlocked){
            if(userObj.isProfileComplete) {
                if (userObj.isApproved) {
                    navigation.reset({index: 0, routes: [{name: 'HomeScreen'}],})

                } else {
                    setCurrentUI("UNAPPROVED")
                }
            } else setCurrentUI("EDITPROFILE")

        }else{
            setCurrentUI("BLOCKED")
        }
    }

    const updateProfile =  async () => {
        if (name.trim().length === 0) {
            Alert.alert("Required", "Please enter name");
            return;
        }
        if (email.trim().length === 0) {
            Alert.alert("Required", "Please enter email");
            return;
        }
        if (landmark.trim().length === 0) {
            Alert.alert("Required", "Please enter landmark");
            return;
        }
        if (pincode.trim().length === 0) {
            Alert.alert("Required", "Please enter pincode");
            return;
        }
        if (address.trim().length === 0) {
            Alert.alert("Required", "Please enter address");
            return;
        }
        if (state.trim().length === 0) {
            Alert.alert("Required", "Please enter state");
            return;
        }
        if(!vehicleType){
            Alert.alert("Required", "Please select vehicle type");
            return;
        }
        if(!rc){
            Alert.alert("Required", "Please select rc");
            return;
        }
        if(!selfie){
            Alert.alert("Required", "Please select selfie");
            return;
        }
        if(!insurance){
            Alert.alert("Required", "Please select insurance");
            return;
        }

        setUploading(true);
        try{
            const rcImage=await uploadImage(rc);
            const selfieImage=await uploadImage(selfie);
            const insuranceImage=await uploadImage(insurance);

            let profieObj = {
                phone: phonenumber,
                name,
                rcImage,
                insuranceImage,
                selfieImage,
                email,
                landmark,
                pincode,
                address,
                state,
                vehicleType,
                blockNo,
                address2,
                lastName,
                isProfileComplete: true
            };
            navigateScreen = true;
            saveProfile(profieObj)
            setUploading(false);

        } catch (e) {
            console.error(e)
            setUploading(false);

        }

    }
    const Logout = (callBack) => {
        setIsprocessing(true)
        auth()
            .signOut()
            .then(() => {
                setIsprocessing(false);
                Constants.clearStorageOnLogout();
                setPhonenumber("");
                setName("")
                setEmail("")
                setLandmark("")
                setPincode("")
                setVehicleType("")
                setAddress("")
                setIsprocessing(false)
                navigation.reset({ index: 0, routes: [{ name: 'LoginScreen' }], })
            });
    };
    const loginWithPhoneNumber = async () => {
        if (phonenumber.length === 10) {
            AsyncStore.setItem("phone", phonenumber);
            setIsprocessing(true)
            try {
                const confirmation = await auth().signInWithPhoneNumber(
                    "+91" + phonenumber
                );
                setConfirm(confirmation);
                setCurrentUI("OTP")
            } catch (err) {
                Alert.alert("FreshTables", err.message);
            } finally {
                setIsprocessing(false)
            }
        } else {
            Alert.alert("Required", "Please provide a valid 10 digit phone number.");
        }
    }
    const confirmCode = async () => {
        if (otpCode.toString().trim().length == 0) {
            Alert.alert("Empty code", "Enter OTP");
            return;
        }
        setIsprocessing(true)
        try {
            await confirm.confirm(otpCode);
            setOtpCode("")
        } catch (error) {
            setOtpCode("")
            setCurrentUI("LOGIN")
            Alert.alert("Invalid code.", "Given code is invalid");
        } finally {
            setIsprocessing(false)
        }
    }
    return (
        <>
        {
                    currentUI === "BLOCKED" ? (
                    <>
                        <View style={{ paddingTop: 20,flex:1,justifyContent:"center",alignItems:"center" }}>
                            <Text style={{fontSize:18}}>Sorry your account is blocked, Please contact admin for further details</Text>

                        </View>
                    </>
                ) : <></>
            }
            {
                currentUI === "UNAPPROVED"&&<>
                    <View style={{ paddingTop: 20,flex:1,justifyContent:"center",alignItems:"center" }}>
                        <Text style={{fontSize:18,color:"#000"}}>Your profile has not been approved yet. Please wait for your profile to be approved.</Text>
                        <Ripple
                            onPress={() => { loadUsers(phonenumber) }}
                            style={{
                                width: 150, borderColor: "#000",
                                paddingHorizontal: 5,
                                paddingVertical:10,
                                borderRadius: 50,

                                backgroundColor: Constants.colorCode.liteGray3,
                                borderWidth: 0
                            }}>
                            <Text style={{ textAlign: "center", color: "#000", fontSize: 20, fontWeight:"600" }}>Refresh</Text>
                        </Ripple>
                    </View>
                </>
            }
            {
                currentUI === "LOGIN" ? (
                    <>
                        <View style={{ paddingTop: 20 }}>
                            <View style={{display:"flex",alignItems:"center"}}>
                                <Image style={{marginVertical:50}} source={require('../../assets/images/logoRound.png')}/>

                            </View>
                            <TextInput
                                style={styles.input}
                                onChangeText={(e) => {
                                    let myStr = e;
                                    myStr = myStr.replace(/\D/g, "");
                                    setPhonenumber(myStr)
                                }}
                                value={phonenumber}
                                placeholderTextColor="#000"
                                placeholder="Phone No."
                                keyboardType="numeric"
                                underlineColorAndroid={"#00000000"}
                            />
                        </View>
                        <View style={{ flexDirection: "row", width: "100%", marginVertical: 8, justifyContent: "space-evenly" }}>
                            {isprocessing ? (<ActivityIndicator color={"#000"} />) : (
                                <>
                                    {/*
                            <Ripple
                                        onPress={() => { loginWithPhoneNumber() }}
                                        style={{
                                            width: 150, borderColor: "#000",
                                            padding: 5,
                                            borderRadius: 5,
                                            backgroundColor: Constants.colorCode.liteGray,
                                            borderWidth: 1
                                        }}>
                                        <Text style={{ textAlign: "center", color: "#000", fontSize: 20 }}>Sign Up</Text>
                                    </Ripple>
                         */}

                                    <Ripple
                                        onPress={() => { loginWithPhoneNumber() }}
                                        style={{
                                            width: 150, borderColor: "#000",
                                            paddingHorizontal: 5,
                                            paddingVertical:10,
                                            borderRadius: 50,

                                            backgroundColor: Constants.colorCode.liteGray3,
                                            borderWidth: 0
                                        }}>
                                        <Text style={{ textAlign: "center", color: "#000", fontSize: 20, fontWeight:"600" }}>Login</Text>
                                    </Ripple>

                                </>
                            )}


                        </View>
                    </>
                ) : <></>
            }
            {
                currentUI === "OTP" ? (
                    <>
                        <View style={{ paddingTop: 20 }}>
                            <TextInput
                                style={styles.input}
                                onChangeText={(e) => {
                                    let myStr = e;
                                    myStr = myStr.replace(/\D/g, "");
                                    setOtpCode(myStr)
                                }}
                                value={otpCode}
                                placeholder="Enter OTP"
                                keyboardType="numeric"
                                underlineColorAndroid={"#00000000"}
                            />
                        </View>
                        <View style={{ flexDirection: "row", width: "100%", marginVertical: 8, justifyContent: "space-evenly" }}>
                            {isprocessing ? (<ActivityIndicator color={"#000"} />) : (

                                <Ripple
                                    onPress={() => { confirmCode() }}
                                     style={{
                                        width: 150, borderColor: "#000",
                                        padding: 5,
                                        borderRadius: 5,
                                        backgroundColor: Constants.colorCode.liteGray,
                                        borderWidth: 1
                                    }}>
                                    <Text style={{ textAlign: "center", color: "#000", fontSize: 20 }}>Verify</Text>
                                </Ripple>

                            )}

                        </View>
                    </>
                ) : <></>
            }
            {
                currentUI === "EDITPROFILE" ? (
                    <ScrollView>
                        <Text style={{ textAlign: "center", fontSize: 27, color:"#000", fontWeight:"600", marginVertical:10 }}>Edit Profile</Text>
                        <Text style={{ fontSize: 23, color:"#000", fontWeight:"bold", marginHorizontal:30 }}>Name</Text>
                        <View style={{display:"flex",flexDirection:"row"}}>
                            <TextInput
                                style={[styles.input,{width:"40%"}]}
                                multiline
                                onChangeText={(e) => { setName(e) }}
                                value={name}
                                placeholder="First Name"
                                underlineColorAndroid={"#00000000"}
                            />
                            <TextInput
                                style={[styles.input,{width:"40%"}]}
                                multiline
                                onChangeText={(e) => {
                                    setLastName(e)
                                }}
                                value={lastName}
                                placeholder="Last Name"
                                underlineColorAndroid={"#00000000"}
                            />
                        </View>
                        <Text style={{ fontSize: 23, color:"#000", fontWeight:"bold", marginHorizontal:30 }}>Email</Text>

                        <View style={{ paddingTop: 5 }}>
                            <TextInput
                                style={styles.input}
                                onChangeText={(e) => {
                                    setEmail(e)
                                }}
                                value={email}
                                placeholder="Enter Email"
                                underlineColorAndroid={"#00000000"}
                            />
                        </View>
                        <Text style={{ fontSize: 23, color:"#000", fontWeight:"bold", marginHorizontal:30 }}>Address</Text>

                        <View style={{ paddingTop: 5 }}>
                            <TextInput
                                style={[styles.input]}
                                multiline
                                onChangeText={(e) => {
                                    setAddress(e)
                                }}
                                value={address}
                                placeholder="Enter Address Line 1"
                                underlineColorAndroid={"#00000000"}
                            />
                            <TextInput
                                style={[styles.input]}
                                multiline
                                onChangeText={(e) => {
                                    setAddress2(e)
                                }}
                                value={address2}
                                placeholder="Enter Address Line 2"
                                underlineColorAndroid={"#00000000"}
                            />
                            <View style={{display:"flex",flexDirection:"row"}}>
                                <TextInput
                                    style={[styles.input,{width:"40%"}]}
                                    multiline
                                    onChangeText={(e) => {
                                        setLandmark(e)
                                    }}
                                    value={landmark}
                                    placeholder="Landmark"
                                    underlineColorAndroid={"#00000000"}
                                />
                                <TextInput
                                    style={[styles.input,{width:"40%"}]}
                                    multiline
                                    onChangeText={(e) => {
                                        setState(e)
                                    }}
                                    value={state}
                                    placeholder="State"
                                    underlineColorAndroid={"#00000000"}
                                />
                            </View>
                            <View style={{display:"flex",flexDirection:"row"}}>
                                <TextInput
                                    style={[styles.input,{width:"40%"}]}
                                    multiline
                                    onChangeText={(e) => {
                                        setPincode(e)
                                    }}
                                    value={pincode}
                                    placeholder="Pincode"
                                    underlineColorAndroid={"#00000000"}
                                />
                                <TextInput
                                    style={[styles.input,{width:"40%"}]}
                                    multiline
                                    onChangeText={(e) => {
                                        setBlockNo(e)
                                    }}
                                    value={blockNo}
                                    placeholder="Block No."
                                    underlineColorAndroid={"#00000000"}
                                />
                            </View>

                        </View>
                        <Text style={{ fontSize: 23, color:"#000", fontWeight:"bold", marginHorizontal:30 }}>Type of Car</Text>

                        <View style={{ paddingTop: 5 }}>
                            <SelectDropdown buttonStyle={styles.input} data={["2 Wheeler","4 Wheeler"]} onSelect={(s)=>setVehicleType(s)}/>
                        </View>
                        <View style={{display:"flex",justifyContent:"space-between",flexDirection:"row",paddingHorizontal:10,marginVerticalar:10}}>
                            <Ripple
                                onPress={()=> selectImage(setSelfie,"selfie.jpg") }
                                style={{
                                    width: "30%", borderColor: "#000",
                                    padding: 5,
                                    borderRadius: 5,
                                    backgroundColor: Constants.colorCode.liteGray,
                                    borderWidth: 1
                                }}>
                                <Text style={{ textAlign: "center", color: (selfie?"green":"#000"), fontSize: 20 }}>Selfie</Text>
                            </Ripple>
                            <Ripple
                                onPress={ ()=>selectImage(setRC,"rc.jpg") }
                                style={{
                                    width: "30%", borderColor: "#000",
                                    padding: 5,
                                    borderRadius: 5,
                                    backgroundColor: Constants.colorCode.liteGray,
                                    borderWidth: 1
                                }}>
                                <Text style={{ textAlign: "center", color:(rc?"green":"#000"), fontSize: 20 }}>RC</Text>
                            </Ripple>
                            <Ripple
                                onPress={ ()=>selectImage(setInsurance,"insurance.jpg")}
                                style={{
                                    width: "30%", borderColor: "#000",
                                    padding: 5,
                                    borderRadius: 5,
                                    backgroundColor: Constants.colorCode.liteGray,
                                    borderWidth: 1
                                }}>
                                <Text style={{ textAlign: "center", color: (insurance?"green":"#000"), fontSize: 20 }}>Insurance</Text>
                            </Ripple>
                        </View>

                        {isprocessing ? (<ActivityIndicator color={"#000"} />) : (
                            <View style={{ flexDirection: "column", width: "100%", marginVertical: 8, justifyContent: "center", alignItems: "center" }}>

                                <Ripple
                                    disabled={uploading  }
                                    onPress={updateProfile}
                                    style={{
                                        width: 150, borderColor: "#000",
                                        padding: 5,
                                        borderRadius: 5,
                                        backgroundColor: Constants.colorCode.liteGray,
                                        borderWidth: 1
                                    }}>
                                    <Text style={{ textAlign: "center", color: "#000", fontSize: 20 }}>{uploading?"Loading":"Update"}</Text>
                                </Ripple>


                                <Ripple
                                    onPress={() => { Logout() }}
                                    style={{
                                        width: 150, borderColor: "#000",
                                        padding: 5,
                                        borderRadius: 5,
                                        marginTop: 30,
                                        backgroundColor: Constants.colorCode.liteGray,
                                        borderWidth: 1
                                    }}>
                                    <Text style={{ textAlign: "center", color: "#000", fontSize: 20 }}>Logout</Text>
                                </Ripple>

                            </View>
                        )}

                    </ScrollView>
                ) : <></>
            }

        </>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: Constants.colorCode.liteGray3,
        paddingVertical: 10,
        paddingHorizontal:5,
        fontSize: 20,
        borderRadius: 50, marginHorizontal: 20,
        marginVertical:20,
        fontWeight:"600",
        backgroundColor:Constants.colorCode.liteGray3,
        textAlign:"center"
    }
})
