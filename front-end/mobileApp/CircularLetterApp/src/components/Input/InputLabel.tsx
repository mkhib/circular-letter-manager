/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Animated,
  Easing,
  StyleProp,
  TextStyle,
} from "react-native";
import { Styles, Shape } from "../../assets/styles/base";

function animate(value: Animated.Value, to: number) {
  Animated.timing(value, {
    toValue: to,
    duration: 200,
    easing: Easing.linear,
    useNativeDriver: false,
  }).start();
}

function InputLabel(props: LabelProps) {
  const { focused = false, label, style: customStyle } = props;
  const FONT_SIZE = 13 / (focused ? 1.3 : 1);
  const PADDING_BOTTOM = focused ? 35 : 0;
  const [fontSize] = useState(new Animated.Value(FONT_SIZE));
  const [paddingBottom] = useState(new Animated.Value(PADDING_BOTTOM));
  useEffect(() => {
    animate(fontSize, FONT_SIZE);
    animate(paddingBottom, PADDING_BOTTOM);
  }, [focused]);
  const style = StyleSheet.flatten([
    Styles.placeholder,
    customStyle,
    { fontSize, paddingBottom },
  ]);
  return <Animated.Text style={style} children={label} />;
}

export default InputLabel;

export interface LabelProps {
  focused?: boolean;
  label?: string;
  style?: StyleProp<TextStyle>;
}
