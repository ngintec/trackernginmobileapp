import React, {Component} from 'react';
import { StyleSheet, Button, View, SafeAreaView, Text, Alert } from 'react-native';

export default class WrappedButton extends Component{
    render(){
        const  {
            title,
            onPress,
            color
        } = this.props;
        return(
            <Button
                title={title}
                disabled={false}
                onPress={() => {
                    onPress();
                }}
                color={color}
            />
        )
    }
}