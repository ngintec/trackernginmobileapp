import React, {Component} from 'react';
import {Pressable, StyleSheet, TouchableOpacity, View} from 'react-native';
import {colors, globalHeight, globalWidth} from '../../constants/Dimension';

export default class DrawerIcon extends Component {
  render() {
    const {onPress} = this.props;
    return (
      <Pressable
        onPress={() => {
          onPress();
        }}>
        <View style={styles.container1}>
          <View style={[styles.lines]} />
          <View style={[styles.lines]} />
          <View style={[styles.lines]} />
        </View>
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  container1: {
    backgroundColor: 'black',
    width: globalWidth * 0.12,
    height: globalHeight * 0.065,
    marginTop: globalHeight * 0.05,
    marginLeft: globalWidth * 0.05,
    borderRadius: globalHeight / 2,
  },
  lines: {
    backgroundColor: colors.white,
    borderRadius: globalHeight / 0.1,
    width: globalWidth * 0.09,
    height: globalHeight * 0.006,
    top: 11.5,
    left: 4,
    margin: 1.1,
  },
});
