import auth from "@react-native-firebase/auth";

export function getCurrentUserAuth(){
    if(auth().currentUser) return auth().currentUser
    return null;
}
