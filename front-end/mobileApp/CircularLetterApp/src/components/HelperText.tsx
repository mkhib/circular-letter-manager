import React from 'react';
import {StyleSheet, Text, StyleProp, TextStyle} from 'react-native';
import {Colors} from '../assets/styles/base';

function HelperText({error, style}: HelperTextProps) {
  if (error) {
    return (
      <Text style={StyleSheet.flatten([styles.error, style])}>{error}</Text>
    );
  }
  return null;
}

export default HelperText;

const styles = StyleSheet.create({
  error: {
    color: Colors.error,
    fontFamily: 'Samim-FD',
    fontSize: 12,
  },
});

export interface HelperTextProps {
  error?: string;
  style?: StyleProp<TextStyle>;
}
