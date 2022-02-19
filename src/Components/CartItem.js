import React,{useState, useEffect} from 'react'
import { StyleSheet, Text, View,Image,TouchableOpacity } from 'react-native'
import * as Constants from '../Constants/index'
const CartItem = ({product,image}) => {
    const [quantity, setQuantity] = useState(product.quantity)
    const addToCart = async(product)=>{
        await Constants.addDataToCart(product);
        Constants.StateStore.update(s => {
            s.cartlist = Constants.AppData.cartlist;
          });
    }
    const removeToCart = async(product)=>{
        await Constants.clearCart(product);
        Constants.StateStore.update(s => {
            s.cartlist = Constants.AppData.cartlist;
          });
        // if(quantity!=0)
        // setQuantity(quantity-1)
    }
    return (
        <View key={Math.random()}
            style={{
                height: 80,
                marginTop: 5,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between', marginHorizontal: 10,
                width: "100%",
                alignSelf: 'center',
                borderBottomWidth: 1,
                borderBottomColor: "#ccc"
            }}>
            <View style={{
                flexDirection: 'row',
                alignItems: "center",
                flex: 1.2,
            }}>
                <View style={{ width: 60, height: 60, }}>
                    {image ? (
                        <Image
                            source={{ uri: image.url }}
                            style={{ width: 60, height: 60, marginLeft: 10, resizeMode: 'cover' }}></Image>
                    ) : (
                        <Image
                            source={Constants.localImages.productNotFound}
                            style={{ width: 60, height: 60, marginLeft: 10, resizeMode: 'cover' }}></Image>
                    )}

                </View>
            </View>
            <View style={{ flex: 3, height: "100%", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 20, color: "#000", marginLeft: 15, }}>{product.title}</Text>
                <View style={{ flexDirection: "row", marginLeft: 15, marginBottom: 10, }}>
                    <TouchableOpacity onPress={() => { removeToCart(product) }} style={styles.leftButton}><Text>-</Text></TouchableOpacity>
                    <Text style={styles.buttonText}>{product.quantity}</Text>
                    <TouchableOpacity onPress={() => { addToCart(product) }} style={styles.rightButton}><Text>+</Text></TouchableOpacity>
                </View>
            </View>
            <View style={{ flex: 1, height: "100%" }}>
                <Text>{product.price[0].amount}</Text>
            </View>
        </View>
    )
}

export default CartItem

const styles = StyleSheet.create({
    leftButton: {
        backgroundColor: "#ececec",
        width: 25,
        height: 25,
        justifyContent: "center",
        alignItems: "center",
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5
    },
    buttonText: {
        backgroundColor: "#ececec",
        justifyContent: "center",
        alignItems: "center",
        height: 25,
        minWidth: 15,
        textAlign: "center",
        paddingTop: 2
    },
    rightButton: {
        backgroundColor: "#ececec",
        width: 25,
        height: 25,
        justifyContent: "center",
        borderTopRightRadius: 5,
        alignItems: "center",
        borderBottomRightRadius: 5
    }
})
