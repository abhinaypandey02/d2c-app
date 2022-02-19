import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import * as Constants from '../Constants'
import Feather from 'react-native-vector-icons/Feather';
const Ratings = (props) => {
    return (
        <View style={{ flexDirection: "row" }}>
                <Feather
                    name="star"
                    style={{ fontSize: 18, color: Constants.colorCode.orange1, }}
                />
                <Feather
                    name="star"
                    style={{ fontSize: 18, color: Constants.colorCode.orange1, }}
                />
                <Feather
                    name="star"
                    style={{ fontSize: 18, color: Constants.colorCode.orange1, }}
                />
                <Feather
                    name="star"
                    style={{ fontSize: 18, color: Constants.colorCode.orange1, }}
                />
                <Feather
                    name="star"
                    style={{ fontSize: 18, color: Constants.colorCode.orange1, }}
                />
                <Text style={{ color: Constants.colorCode.black }}> ({props.rating})</Text>
            </View>
    )
}

export default Ratings

const styles = StyleSheet.create({})
