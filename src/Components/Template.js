import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { View, StyleSheet, Text, Image, StatusBar, TextInput as SimpleTextInput } from 'react-native';
import * as Constants from '../Constants'
import Header from './Header'
import Footer from './Footer'
import { Provider as PaperProvider } from 'react-native-paper';
const Template = ({ navigation, children, style }) => {
    return (
        <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
            <Header navigation={navigation} />
            <ScrollView contentContainerStyle={{flexGrow: 1}} style={[{ flex: 1 },style]}>
                {children}
            </ScrollView>
            <Footer navigation={navigation} />
        </View>
    )
}

export default Template

