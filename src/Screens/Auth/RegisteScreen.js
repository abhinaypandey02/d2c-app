import React from 'react'
import { StyleSheet, Text, View,Image } from 'react-native'
import Template from '../../Components/Template'
import * as Constants from '../../Constants'
const RegisteScreen = ({navigation}) => {
    return (
        <>
            <Template navigation={navigation} style={{ backgroundColor: '#fff', }}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{marginTop:20,fontSize:20,textAlign:'center'}}>Register Screen</Text>
                    <Image
                        source={Constants._uc_png}
                        style={{ width: '100%', height: '100%', resizeMode: 'contain' }}></Image>
                </View>
            </Template>
        </>
    )
}

export default RegisteScreen

const styles = StyleSheet.create({})
