import database from "@react-native-firebase/database";
import routes from './routes';
import {getCurrentUserAuth} from "./auth";

export async function getUserDB(uid) {
    const snap = await database().ref(routes.user + '/' + uid).once("value");
    if (snap && snap.val()) {
        return snap.val();
    }
    return null;
}

export async function setUserDB(uid, user) {
    await database().ref(routes.user + '/' + uid).update({...user});
}

export async function getCurrentUserDB() {
    const currentUser = getCurrentUserAuth();
    if (currentUser) {
        const user = await getUserDB(currentUser.uid);
        if (user) return user;
    }
    return null;

}

export async function setCurrentUserDB(user) {
    const currentUser = getCurrentUserAuth();
    if (currentUser) {
        await setUserDB(currentUser.uid, user);
    }
    console.error("Trying to update user but no user found")
}
