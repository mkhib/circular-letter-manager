/* eslint-disable prettier/prettier */
import React from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Colors, Styles, Shape } from '../assets/styles/base';

function MainButton(props: IButtonProps) {
  const { color = 'default', disabled, loading, styles: customStyles = {}, text, ...touchableOpacityProps } = props;

  function Loading() {
    if (loading) {
      return <ActivityIndicator size="large" style={styles.activityIndicator} color={Colors.primary} />;
    }
    return null;
  }

  return (
    <TouchableOpacity
      {...touchableOpacityProps}
      disabled={disabled || loading}
      activeOpacity={Shape.touchableOpacity}
      style={StyleSheet.flatten([styles.root, customStyles.root])}
    >
      <Loading />
      <View style={StyleSheet.flatten([styles.button, colors[color], disabled && colors.disabled])}>
        <Text style={StyleSheet.flatten([Styles.normalText, texts[color], disabled && texts.disabled])}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default MainButton;

const styles = StyleSheet.create({
  activityIndicator: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    opacity: 0.75,
    position: 'absolute',
    zIndex: 1000,
  },
  button: {
    alignItems: 'center',
    height: Shape.rowHeight,
    justifyContent: 'center',
  },
  root: {
    ...Styles.border,
    borderRadius: 5,
    justifyContent: 'center',
  },
});

const colors = StyleSheet.create({
  default: {
    backgroundColor: Colors.midGray,
  },
  disabled: {
    backgroundColor: Colors.lightgrey,
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.secondary,
  },
});

const texts = StyleSheet.create({
  default: {
    color: Colors.text,
  },
  disabled: {
    color: Colors.midGray,
  },
  primary: {
    color: Colors.white,
  },
  secondary: {
    color: 'white',
  },
});

export interface IButtonProps extends Omit<TouchableOpacityProps, 'activeOpacity' | 'style'> {
  color?: 'default' | 'primary' | 'secondary';
  loading?: boolean;
  styles?: {
    root?: StyleProp<ViewStyle>;
  };
  text?: string;
}
