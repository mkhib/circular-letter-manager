/* eslint-disable prettier/prettier */
import React, { useState, forwardRef } from "react";
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  TextInputFocusEventData,
  NativeSyntheticEvent,
  StyleProp,
  TextStyle,
} from "react-native";
import { Styles } from "../../assets/styles/base";
import BaseInput, { IBaseInputProps } from "./BaseInput";

const TextInputer = forwardRef((props: ITextInputerProps, ref: React.LegacyRef<TextInput>) => {
  const { error, label, onBlur, onFocus, styles: customStyles = {}, ...inputProps } = props;
  const [focused, setFocused] = useState(!!props.value);

  function handleBlur(e: NativeSyntheticEvent<TextInputFocusEventData>) {
    if (onBlur) {
      onBlur(e);
    }
    if (!inputProps.value) {
      setFocused(false);
    }
  }

  function handleFocus(e: NativeSyntheticEvent<TextInputFocusEventData>) {
    if (onFocus) {
      onFocus(e);
    }
    if (!inputProps.value) {
      setFocused(true);
    }
  }

  return (
    <BaseInput error={error} focused={focused} label={label} styles={customStyles.baseInput}>
      <TextInput
        ref={ref}
        {...inputProps}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={StyleSheet.flatten([styles.input, customStyles.input])}
      />
    </BaseInput>
  );
});

export default TextInputer;

const styles = StyleSheet.create({
  input: {
    ...Styles.normalText,
    padding: 0,
  },
});

export interface ITextInputerProps extends Omit<TextInputProps, "style"> {
  error?: string;
  label?: string;
  styles?: {
    input?: StyleProp<TextStyle>;
    baseInput?: IBaseInputProps["styles"];
  };
}
