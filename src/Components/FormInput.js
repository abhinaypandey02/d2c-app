import {useController} from "react-hook-form";
import {TextInput} from "react-native";

export default function FormInput({name,control,defaultValue,style}){
    const {field}=useController({
        control,
        defaultValue,
        name
    })
    return <TextInput value={field} onChange={field.onChange} style={[style]}/>
}
