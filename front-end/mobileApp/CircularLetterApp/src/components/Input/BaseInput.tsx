/* eslint-disable prettier/prettier */
import React, { PropsWithChildren, ReactNode } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Colors, Styles, Shape } from '../../assets/styles/base';
import HelperText from '../HelperText';
import InputLabel from './InputLabel';
import Card from '../Card';

function BaseInput(props: PropsWithChildren<IBaseInputProps>) {
  const { children, error, focused, icon, label, styles: customStyles = {} } = props;
  function Icon() {
    if (icon) {
      return <View style={styles.icon} children={icon} />;
    }
    return null;
  }
  return (
    <View style={StyleSheet.flatten([styles.root, customStyles.root])}>
      <Card style={styles.card}>
        <InputLabel style={styles.label} label={label} focused={focused} />
        <View style={StyleSheet.flatten([styles.input, customStyles.input])} children={children} />
        <Icon />
      </Card>
      <HelperText style={styles.error} error={error} />
    </View>
  );
}

export default BaseInput;

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    flexDirection: 'row',
    height: Shape.input.height,
  },
  error: {
    marginLeft: Shape.spacing(),
    marginTop: Shape.spacing(0.5),
  },
  icon: {
    alignItems: 'center',
    borderLeftColor: Colors.midGray,
    borderLeftWidth: 1,
    height: 30,
    justifyContent: 'center',
    width: 40,
  },
  input: {
    flex: 1,
    marginHorizontal: Shape.spacing(),
    marginTop: Styles.placeholder.fontSize / 1.3,
  },
  label: {
    position: 'absolute',
    left: Shape.spacing(),
  },
  root: {
    marginBottom: Shape.spacing(),
  },
});

export interface IBaseInputProps {
  error?: string;
  icon?: ReactNode;
  label?: string;
  focused?: boolean;
  styles?: {
    input?: StyleProp<ViewStyle>;
    root?: StyleProp<ViewStyle>;
  };
}
