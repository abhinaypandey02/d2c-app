import {useController} from "react-hook-form";
import {TextInput, View, Text} from "react-native";
import React from 'react';
function getErrorMessage(code){
    switch (code){
        case "required":return "This field is required"
        default: return "Error in this field"
    }

}
export default function FormInput({name,control,defaultValue,style,placeholder,underlineColorAndroid,multiline}){
    const {field,fieldState:{error}}=useController({
        control,
        defaultValue,
        name,
        rules:{required:true}
    })
    return <>
        <TextInput value={field.value} onChangeText={field.onChange} style={style} placeholder={placeholder} underlineColorAndroid={underlineColorAndroid} multiline={multiline}/>
        {error&&<Text style={{color:"red",marginHorizontal:20  }}>{getErrorMessage(error.type)}</Text>}
    </>
}
