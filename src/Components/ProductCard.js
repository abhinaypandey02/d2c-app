import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native'
import Feather from 'react-native-vector-icons/Feather';
import Ratings from './Ratings'
import * as Constants from '../Constants'
import Ripple from 'react-native-material-ripple';
import { Provider as PaperProviderProd } from 'react-native-paper';
import CardView from 'react-native-cardview'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { CommonActions } from '@react-navigation/native';
const ProductCard = ({ navigation, navigation: { navigate }, imageUri, keypos, title, navigateTo, Units, ProductItem, cardWidth = "50%" }) => {
    let cartIndicator = Constants.StateStore.useState(s => s.cartIndicator);
    let cartCount = Constants.StateStore.useState(s => s.cartCount);
    // let categoryTitle = Constants.getCategory(Categories, ProductItem.catid).title||"";
    let priceObj = Constants.getCurrentPrice(ProductItem.price)
    let images = Constants.getImages(ProductItem.images);
    const [isProcessing, setisProcessing] = useState(false)
    const addToCartItem = async () => {
        setisProcessing(true)
        // cartCount++;
        let prodItemCopy = { ...ProductItem };
        prodItemCopy.price = [];
        prodItemCopy.quantity = prodItemCopy.quantity || 1;
        prodItemCopy.price.push(priceObj);
        await Constants.addDataToCart(prodItemCopy);
        setisProcessing(false)
        Constants._Toast("Item added to cart")
        Constants.StateStore.update(s => {
            s.cartIndicator = true;
            s.cartCount = Constants.AppData.cartlist.length
        });
    }
    const addToCartWishList = async () => {
        // cartCount++;
        let prodItemCopy = { ...ProductItem };
        prodItemCopy.price = [];
        prodItemCopy.quantity = prodItemCopy.quantity || 1;
        prodItemCopy.price.push(priceObj);
        await Constants.addDataToWishList(prodItemCopy);
        Constants._Toast("Item added to wishlist")
        Constants.StateStore.update(s => {
            s.wishlistIndicator = true;
        });
    }
    return (
        <>
            {ProductItem.hide ? (<></>) : (
                <View style={{ width: cardWidth, padding: 5, }}>
                    <CardView
                        cardElevation={0}
                        cardMaxElevation={0}
                        style={{ width: '100%', height: 170 }}
                        cornerRadius={3}>
                        <PaperProviderProd>
                            <Ripple onPress={() => {
                                let prodItemCopy = { ...ProductItem };
                                prodItemCopy.price = [];
                                prodItemCopy.images = images;
                                prodItemCopy.price.push(priceObj);
                                Constants.AppData.selectedProduct = prodItemCopy;
                                Constants.StateStore.update(s => {
                                    s.updateUI = Math.random();
                                });
                                if (navigateTo != null) {
                                    navigation.dispatch(
                                        CommonActions.navigate({
                                            name: 'ProductDetailsScreen',
                                            params: { type: "ALL", categoryID: "" },
                                        })
                                    );
                                }
                            }} style={styles.cardRipple}>
                                <View style={{ width: '100%', height: "100%", flexDirection: 'row', justifyContent: 'center' }}>
                                    <View style={styles.product_image_container}>
                                        {images ? (
                                            <Image
                                                source={{ uri: images[0].url }}
                                                style={styles.logo}></Image>
                                        ) : (
                                            <Image
                                                source={Constants.localImages.productNotFound}
                                                style={styles.logo}></Image>
                                        )
                                        }
                                    </View>
                                </View>

                            </Ripple>
                        </PaperProviderProd>
                        <View style={{ position: "absolute", borderRadius: 5, bottom: 10, right: 10, zIndex: 1000, height: 25, width: 25 }}>
                            {isProcessing ? (<ActivityIndicator color={"#000"} />) : (
                                <PaperProviderProd >
                                    <Ripple onPress={() => {
                                        addToCartItem()
                                    }} style={{ backgroundColor: Constants.colorCode.black, borderRadius: 5, width: 25, height: 25, justifyContent: "center", alignItems: "center" }}>
                                        <Text style={{ color: Constants.colorCode.white }}>+</Text>
                                    </Ripple>
                                </PaperProviderProd>
                            )}

                        </View>
                        <View style={{ position: "absolute", justifyContent: "center", alignItems: "center", borderRadius: 2, top: 10, left: 10, zIndex: 1000, height: 20, width: 40, backgroundColor: Constants.colorCode.orange1 }}>
                            <Text style={{ color: Constants.colorCode.white }}>SALE</Text>
                        </View>
                        <View style={{ position: "absolute", borderRadius: 5, top: 10, right: 10, zIndex: 1000, height: 25, width: 25 }}>
                            <PaperProviderProd >
                                <Ripple onPress={() => {
                                    addToCartWishList()
                                }} style={{ borderRadius: 5, width: 25, height: 25, justifyContent: "center", alignItems: "center" }}>
                                    <Feather
                                        name="heart"
                                        style={{ fontSize: 23, color: Constants.colorCode.liteGray, textAlign: 'center' }}
                                    />
                                </Ripple>
                            </PaperProviderProd>
                        </View>
                    </CardView>

                    <Text style={{ fontSize: 15, fontWeight: '500' }}>{ProductItem.title}</Text>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ fontSize: 18, fontWeight: '400', textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>₹{priceObj.showPrice}</Text>
                        <Text style={{ fontSize: 18, fontWeight: '600' }}> ₹{priceObj.amount + "/" + Units[priceObj.unitid].title}</Text>
                    </View>
                    <Ratings rating={5} />
                    <View style={{ borderBottomWidth: 1, borderColor: Constants.colorCode.liteGray, width: "100%", marginTop: 5 }}></View>
                </View>
            )}
        </>
    )
}

export default ProductCard

const styles = StyleSheet.create({
    cardRipple: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: "100%"
    },
    product_image_container: {
        width: "100%",
        height: 170,
        marginTop: 2,
        marginLeft: 10,
        marginRight: 10,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    logo: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        alignSelf: 'center'
    },
})
