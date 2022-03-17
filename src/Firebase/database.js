import database from "@react-native-firebase/database";
import routes from './routes';
import {getCurrentUserAuth} from "./auth";
import {Alert} from "react-native";

export async function getUserDB(uid) {
    console.log("DB GET CALLED")
    let snap;
    const success = await new Promise(async resolve => {
        const i = setTimeout(()=>{
            Alert.alert("TIMED OUT","Couldn't make a connection with firebase. Please check you internet connection.")
            resolve(false);
        }, 7000);
        snap = await database().ref(routes.user + '/' + uid).once("value");
        clearTimeout(i)
        resolve(true);
    });
    if (snap && snap.val() && success) {
        return snap.val();
    }
    if(!success) return false;
    return null;
}

export async function setUserDB(uid, user) {
    console.log("DB SET CALLED")
    await database().ref(routes.user + '/' + uid).update({...user});
}

export async function getCurrentUserDB() {
    const currentUser = getCurrentUserAuth();
    if (currentUser) {
        const user = await getUserDB(currentUser.uid);
        console.log("user",user)
        if (user) return user;
        if(user===false) return -2;
        return -1;
    }
    return null;

}

export async function setCurrentUserDB(user) {
    const currentUser = getCurrentUserAuth();
    if (currentUser) {

        await setUserDB(currentUser.uid, user);
    }
    else console.error("Trying to update user but no user found")
}

export async function getCustomersDB(){
    const snap = await database().ref(routes.customers).once("value");
    if (snap && snap.val()) {
        return snap.val();
    }
    return null;
}
export async function getB2BUsersDB(){
    const snap = await database().ref(routes.b2bUsers).once("value");
    if (snap && snap.val()) {
        return snap.val();
    }
    return null;
}
export async function getD2COrdersDB(){
    const snap = await database().ref(routes.d2cOrder).once("value");
    if (snap && snap.val()) {
        return snap.val();
    }
    return null;
}
export async function getB2BOrdersDB(){
    const snap = await database().ref(routes.b2bOrder).once("value");
    if (snap && snap.val()) {
        return snap.val();
    }
    return null;
}
export async function getDeliveryEarningDB(){
    const snap = await database().ref(routes.deliveryEarnings).once("value");
    if (snap && snap.val()) {
        return snap.val();
    }
    return null;
}
