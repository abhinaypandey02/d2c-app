import React from 'react'
import { StyleSheet, Image, View } from 'react-native'
import Ripple from 'react-native-material-ripple';
import { Provider as PaperProviderCat } from 'react-native-paper';
import CardView from 'react-native-cardview'
import { TouchableOpacity } from 'react-native-gesture-handler'
import * as Constants from '../Constants'
import { CommonActions } from '@react-navigation/native';

const CatCards = ({ navigation, navigation: {navigate}, imageUri, Category, catid, navigateTo }) => {
    return (
        <>
            {
                (!Category.hide && Category.showinhome) ? (
                    <View style={{ width: '50%', padding: 5, height: 150 }}>
                        <View style={styles.bottomStyle}>
                            <CardView
                                cardElevation={0}
                                cardMaxElevation={0}
                                style={{ width: '100%', height: '100%' }}
                                cornerRadius={3}>
                                <PaperProviderCat>
                                    <Ripple onPress={() => {
                                        if (navigateTo != null) {
                                            Constants.route.params = { type: "CATEGORY", categoryID: "" };
                                            navigation.dispatch(
                                                CommonActions.navigate({
                                                    name: 'ProductsScreen',
                                                    params: { type: "CATEGORY", categoryID: catid },
                                                })
                                            );
                                        }
                                    }} style={styles.cardRipple}>
                                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center' }}>
                                            <View style={styles.image_container}>
                                                {imageUri ? (
                                                    <Image
                                                        source={{ uri: imageUri }}
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
                                </PaperProviderCat>
                            </CardView>
                        </View>
                    </View>
                ) : (<></>)

            }
        </>
    )
}

export default CatCards

const styles = StyleSheet.create({
    catText: {
        color: Constants.colorCode.black,
        fontSize: 22,
        textAlign: "center",
        paddingVertical: 10
    },
    catCard: {
        width: "100%",

    },
    cardRipple: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: Constants.colorCode.white,
    },
    image_container: {
        width: "100%",
        height: "100%",
        marginTop: 2,
        marginLeft: 10,
        marginRight: 10,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    product_image_container: {
        width: "100%",
        height: 150,
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
