import React, {Component} from "react";
import {Text,View,TextInput,StyleSheet,TouchableOpacity,} from "react-native";

export default class WrappedTextInput extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render(){
        const  {
            value,
            onChangeText,
            placeholder,
            keyboardType,
            secureTextEntry,
            password,
            visiblepassword,
            style,
        } = this.props;
        return(
            <View>
                <TextInput
                    value = {value}
                    onChangeText = {onChangeText}
                    placeholder = {placeholder}
                    keyboardType = {keyboardType}
                    secureTextEntry = {secureTextEntry}
                    password={password}
                    visible-password = {visiblepassword}
                    style={style}
                />
            </View>
        )
    }
}