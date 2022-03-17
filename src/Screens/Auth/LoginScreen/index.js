import React, {useEffect, useState} from 'react'
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native'
import * as Constants from '../../../Constants'
import AsyncStore from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import {launchCamera} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import SelectDropdown from 'react-native-select-dropdown'
import Ripple from 'react-native-material-ripple';
import {useDispatch, useSelector} from "react-redux";
import {useForm} from "react-hook-form";
import FormInput from "../../../Components/FormInput";
import {getCurrentUser, setCurrentUser} from "../../../Redux/Actions";
import {getCurrentUserAuth} from "../../../Firebase/auth";

const LoginScreen = ({navigation}) => {
    const user = useSelector(state => state.user);
    const {control, handleSubmit} = useForm();
    const dispatch=useDispatch();
    const authUser=getCurrentUserAuth();
    const [phonenumber,setPhonenumber]=useState("");
    const [isprocessing, setIsprocessing] = useState(false)
    const [imagesUploaded,setImagesUploaded] = useState(0);
    const [confirm, setConfirm] = React.useState(null);
    const [otpCode, setOtpCode] = useState("")
    const [currentUI, setCurrentUI] = useState("LOADING")
    const [vehicleType, setVehicleType] = useState()
    const [rc, setRC] = useState(null);
    const [selfie, setSelfie] = useState(null);
    const [insurance, setInsurance] = useState(null);
    const [uploading,setUploading] = useState(false);
    let navigateScreen = true;
    useEffect(()=>{
        setUploading(false);
        setImagesUploaded(0);
        if(user.isLoaded){
            if(user.isLoggedIn){
                if(!user.isBlocked){
                    if(user.isProfileComplete) {
                        if (user.isApproved) {
                            navigation.reset({index: 0, routes: [{name: 'HomeScreen'}],})

                        } else if(user.isRejected){
                            setCurrentUI("EDITPROFILE")
                        } else {
                            setCurrentUI("UNAPPROVED")
                        }
                    } else setCurrentUI("EDITPROFILE")

                }else{
                    setCurrentUI("BLOCKED")
                }
            } else setCurrentUI("LOGIN")
        }

        console.log(65, user)

        if(user&&user.isLoggedIn&&user.isLoaded&&!user.userid){
            const dt = new Date();
            const unique = Math.random().toString().substring(4, 6);
            const unique2 = Math.random().toString().substring(4, 6);
            const userid = unique + "" + dt.getTime() + "" + unique2;
            dispatch(setCurrentUser({
                userid,
                phone:"",
                name:"",
                email:"",
                vehicleType,
                landmark:"",
                address2:"",
                state:"",
                blockNo:"",
                lastName:"",
                pincode:"",
                address:"",
                isVerified: false,
                isBlocked: false,
                isProfileComplete: false,
                isApproved: false
            }))
        }
    },[user])
    const selectImage = async (setImage, filename) => {
        const options = {
            maxWidth: 2000,
            maxHeight: 2000,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };
        const response = await launchCamera(options)
        if (response.didCancel) {
        } else if (response.errorCode) {
            console.log('ImagePicker Error: ', response.errorMessage);
        } else {
            const source = {uri: response.assets[0].uri, filename};
            setImage(source);

        }
    }
    const uploadImage = async (image) => {
        const {uri, filename} = image;
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        const task = storage()
            .ref(`images/${phonenumber}/` + filename);
        await task.putFile(uploadUri);
        try {
            await task;
        } catch (e) {
            console.error(e);
        }
        return await task.getDownloadURL();
    };
    const updateProfile = async (data) => {
        if(!authUser||!authUser.phoneNumber||authUser.phoneNumber.length<10){
            Alert.alert("Internal Error", "There has been an error while trying to retrieve user phone number please contact the developer");
            return;
        }
        if (!vehicleType) {
            Alert.alert("Required", "Please select vehicle type");
            return;
        }
        if (!rc) {
            Alert.alert("Required", "Please select rc");
            return;
        }
        if (!selfie) {
            Alert.alert("Required", "Please select selfie");
            return;
        }
        if (!insurance) {
            Alert.alert("Required", "Please select insurance");
            return;
        }
        setUploading(true);
        try {
            const rcImage = await uploadImage(rc);
            setImagesUploaded(1)
            const selfieImage = await uploadImage(selfie);
            setImagesUploaded(2)
            const insuranceImage = await uploadImage(insurance);
            setImagesUploaded(3)
            navigateScreen = true;
            const phone=authUser.phoneNumber.slice(-10);
            console.log(phone)
            dispatch(setCurrentUser({
                ...data,
                isRejected:false,
                isApproved:false,
                rcImage,
                insuranceImage,
                selfieImage,
                vehicleType,
                isProfileComplete: true,
                phone
            }));

        } catch (e) {
            console.error(e)
            setUploading(false);

        }

    }
    const Logout = async () => {
        await auth().signOut()
    };
    const loginWithPhoneNumber = async () => {
        if (phonenumber.length === 10) {
            await AsyncStore.setItem("phone", phonenumber);
            setIsprocessing(true)
            try {
                console.log("SET")
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
        if (otpCode.toString().trim().length === 0) {
            Alert.alert("Empty code", "Enter OTP");
            return;
        }
        setIsprocessing(true)
        try {
            await confirm.confirm(otpCode);
            setOtpCode("")
        } catch (error) {
            console.log(error)
             setOtpCode("")
            setCurrentUI("LOGIN")
            Alert.alert("Invalid code.", "Given code is invalid");
        } finally {
            setIsprocessing(false)
        }
    }
    if(currentUI==="LOADING"){
        return <View style={{flex:1, justifyContent: "center",alignItems:"center"}}>
            <Image style={{marginVertical: 50}}
                   source={require('../../../assets/images/logoRound.png')}/>

        </View>
    }
    if(currentUI === "BLOCKED") return <View style={{paddingTop: 20, flex: 1, justifyContent: "center", alignItems: "center"}}>
        <Text style={{fontSize: 18}}>Sorry your account is blocked, Please contact admin for further
            details</Text>

    </View>
    if(currentUI === "UNAPPROVED") return <View style={{paddingTop: 20, flex: 1, justifyContent: "center", alignItems: "center"}}>
        <Text style={{fontSize: 18, color: "#000"}}>Your profile has not been approved yet. Please wait for
            your profile to be approved. </Text>
        <Ripple
            onPress={() => {
                dispatch(getCurrentUser)
            }}
            style={{
                width: 150, borderColor: "#000",
                paddingHorizontal: 5,
                paddingVertical: 10,
                borderRadius: 50,

                backgroundColor: Constants.colorCode.liteGray3,
                borderWidth: 0
            }}>
            <Text
                style={{textAlign: "center", color: "#000", fontSize: 20, fontWeight: "600"}}>Refresh</Text>
        </Ripple>
    </View>
    if(currentUI === "LOGIN") return <>
        <View style={{paddingTop: 20}}>
            <View style={{display: "flex", alignItems: "center"}}>
                <Image style={{marginVertical: 50}}
                       source={require('../../../assets/images/logoRound.png')}/>

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
        <View style={{
            flexDirection: "row",
            width: "100%",
            marginVertical: 8,
            justifyContent: "space-evenly"
        }}>
            {isprocessing ? (<ActivityIndicator color={"#000"}/>) : (
                <Ripple
                    onPress={loginWithPhoneNumber}
                    style={{
                        width: 150, borderColor: "#000",
                        paddingHorizontal: 5,
                        paddingVertical: 10,
                        borderRadius: 50,

                        backgroundColor: Constants.colorCode.liteGray3,
                        borderWidth: 0
                    }}>
                    <Text style={{
                        textAlign: "center",
                        color: "#000",
                        fontSize: 20,
                        fontWeight: "600"
                    }}>Login</Text>
                </Ripple>
            )}

        </View>
    </>
    if(currentUI === "OTP") return <>
        <View style={{paddingTop: 20}}>
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
        <View style={{
            flexDirection: "row",
            width: "100%",
            marginVertical: 8,
            justifyContent: "space-evenly"
        }}>
            {isprocessing ? (<ActivityIndicator color={"#000"}/>) : (

                <Ripple
                    onPress={confirmCode}
                    style={{
                        width: 150, borderColor: "#000",
                        padding: 5,
                        borderRadius: 5,
                        backgroundColor: Constants.colorCode.liteGray,
                        borderWidth: 1
                    }}>
                    <Text style={{textAlign: "center", color: "#000", fontSize: 20}}>Verify</Text>
                </Ripple>

            )}

        </View>
    </>
    if(currentUI === "EDITPROFILE") return <ScrollView>
        {user.isRejected&&
            <Text style={{textAlign:"center",color:"white",backgroundColor:"#f14646",padding:10}}>Your Profile was rejected.</Text>}
        <Text style={{
            textAlign: "center",
            fontSize: 27,
            color: "#000",
            fontWeight: "600",
            marginVertical: 10
        }}>Edit Profile</Text>
        <Text
            style={styles.formHeading}>Name</Text>
        <FormInput defaultValue={user.name} control={control} name="name" placeholder="First Name"
                   underlineColorAndroid={"#00000000"} style={styles.input}/>
        <FormInput defaultValue={user.lastName} control={control} name="lastName" placeholder="Last Name"
                   underlineColorAndroid={"#00000000"} style={styles.input}/>
        <Text
            style={styles.formHeading}>Email</Text>

        <View style={{paddingTop: 5}}>
            <FormInput defaultValue={user.email} control={control} name="email" placeholder="Enter Email"
                       underlineColorAndroid={"#00000000"} style={styles.input}/>
        </View>
        <Text style={styles.formHeading}>Address</Text>

        <View style={{paddingTop: 5}}>
            <FormInput defaultValue={user.address} control={control} name="address" placeholder="Enter Address Line 1"
                       underlineColorAndroid={"#00000000"} style={styles.input} multiline={true}/>

            <FormInput defaultValue={user.address2} control={control} name="address2" placeholder="Enter Address Line 2"
                       underlineColorAndroid={"#00000000"} style={styles.input} multiline={true}/>
            <View style={{display: "flex", flexDirection: "row"}}>
                <FormInput defaultValue={user.landmark} control={control} name="landmark" placeholder="Enter Landmark"
                           underlineColorAndroid={"#00000000"} style={[styles.input, {width: "40%"}]}/>
                <FormInput defaultValue={user.state} control={control} name="state" placeholder="Enter State"
                           underlineColorAndroid={"#00000000"} style={[styles.input, {width: "40%"}]}/>
            </View>
            <View style={{display: "flex", flexDirection: "row"}}>
                <FormInput defaultValue={user.pincode} control={control} name="pincode" placeholder="Enter Pincode"
                           underlineColorAndroid={"#00000000"} style={[styles.input, {width: "40%"}]}/>
                <FormInput defaultValue={user.blockNo} control={control} name="blockNo" placeholder="Enter Block No."
                           underlineColorAndroid={"#00000000"} style={[styles.input, {width: "40%"}]}/>
            </View>
        </View>
        <Text style={{fontSize: 23, color: "#000", fontWeight: "bold", marginHorizontal: 30}}>Type of
            Car</Text>

        <View style={{paddingTop: 5}}>
            <SelectDropdown buttonStyle={styles.input} data={["2 Wheeler", "4 Wheeler"]}
                            onSelect={(s) => setVehicleType(s)}/>
        </View>
        <View style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            paddingHorizontal: 10,
            marginVertical: 10
        }}>
            <Ripple
                onPress={() => selectImage(setSelfie, "selfie.jpg")}
                style={{
                    width: "30%", borderColor: "#000",
                    padding: 5,
                    borderRadius: 5,
                    backgroundColor: Constants.colorCode.liteGray,
                    borderWidth: 1
                }}>
                <Text style={{
                    textAlign: "center",
                    color: (selfie ? "green" : "#000"),
                    fontSize: 20
                }}>Selfie</Text>
            </Ripple>
            <Ripple
                onPress={() => selectImage(setRC, "rc.jpg")}
                style={{
                    width: "30%", borderColor: "#000",
                    padding: 5,
                    borderRadius: 5,
                    backgroundColor: Constants.colorCode.liteGray,
                    borderWidth: 1
                }}>
                <Text style={{
                    textAlign: "center",
                    color: (rc ? "green" : "#000"),
                    fontSize: 20
                }}>RC</Text>
            </Ripple>
            <Ripple
                onPress={() => selectImage(setInsurance, "insurance.jpg")}
                style={{
                    width: "30%", borderColor: "#000",
                    padding: 5,
                    borderRadius: 5,
                    backgroundColor: Constants.colorCode.liteGray,
                    borderWidth: 1
                }}>
                <Text style={{
                    textAlign: "center",
                    color: (insurance ? "green" : "#000"),
                    fontSize: 20
                }}>Insurance</Text>
            </Ripple>
        </View>

        {isprocessing ? (<ActivityIndicator color={"#000"}/>) : (
            <View style={{
                flexDirection: "column",
                width: "100%",
                marginVertical: 8,
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Ripple
                    disabled={uploading}
                    onPress={handleSubmit(updateProfile)}
                    style={{
                        width: 150, borderColor: "#000",
                        padding: 5,
                        borderRadius: 5,
                        backgroundColor: Constants.colorCode.liteGray,
                        borderWidth: 1
                    }}>
                    <Text style={{
                        textAlign: "center",
                        color: "#000",
                        fontSize: 20
                    }}>{uploading ? "Loading ("+imagesUploaded+"/3)" : "Update"}</Text>
                </Ripple>


                <Ripple
                    onPress={Logout}
                    style={{
                        width: 150, borderColor: "#000",
                        padding: 5,
                        borderRadius: 5,
                        marginTop: 30,
                        backgroundColor: Constants.colorCode.liteGray,
                        borderWidth: 1
                    }}>
                    <Text style={{textAlign: "center", color: "#000", fontSize: 20}}>Logout {user.phone}</Text>
                </Ripple>

            </View>
        )}

    </ScrollView>
    return null;
}

export default LoginScreen

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: Constants.colorCode.liteGray3,
        paddingVertical: 10,
        paddingHorizontal: 5,
        fontSize: 20,
        borderRadius: 50, marginHorizontal: 20,
        marginVertical: 20,
        fontWeight: "600",
        backgroundColor: Constants.colorCode.liteGray3,
        textAlign: "center"
    },
    formHeading:{fontSize: 23, color: "#000", fontWeight: "bold", marginHorizontal: 30
    }})
