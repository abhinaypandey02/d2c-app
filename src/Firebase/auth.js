import auth from "@react-native-firebase/auth";
import firebase from "@react-native-firebase/app";

const firebaseConfig = {

    apiKey: "AIzaSyDuXOGANdHY4QHl-0ChxAuAFouzGZwiSqc",

    authDomain: "freshtables-5ca16.firebaseapp.com",

    databaseURL: "https://freshtables-5ca16-default-rtdb.firebaseio.com",

    projectId: "freshtables-5ca16",

    storageBucket: "freshtables-5ca16.appspot.com",

    messagingSenderId: "893322883008",

    appId: "1:893322883008:web:cec382858c5c91e5c06225",

    measurementId: "G-B5T77PJF2X"

};
export function getCurrentUserAuth(){
    if(firebase.apps.length===0){
        firebase.initializeApp(firebaseConfig);
        try{
            if(auth().currentUser) return auth().currentUser
        } catch (e) {
            return null;
        }
    } else {
        if(auth().currentUser) return auth().currentUser
    }
    return null;
}
