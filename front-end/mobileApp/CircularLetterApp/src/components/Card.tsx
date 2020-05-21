/* eslint-disable prettier/prettier */
import React, { PropsWithChildren, Component } from 'react';
import { View, StyleProp, ViewStyle, StyleSheet, Text } from 'react-native';
import { Styles, Colors, Shape } from '../assets/styles/base';

// function Card(props: PropsWithChildren<ICardProps>) {
//   const { children, style } = props;
//   return <View style={StyleSheet.flatten([styles.root, style])} children={children} />;
// }

class Card extends Component<PropsWithChildren<ICardProps>> {
  render() {
    const { children, style, title } = this.props;
    if (title) {
      return (
        <View style={StyleSheet.flatten([styles.rootWithTitle, style])}>
          <View style={styles.titleViewStyle}>
            <Text style={Styles.placeholder}>
              {title}
            </Text>
          </View>
          {children}
        </View>
      );
    }
    return <View style={StyleSheet.flatten([styles.root, style])} children={children} />;
  }
}

export default Card;

const styles = StyleSheet.create({
  root: {
    ...Styles.border,
    backgroundColor: Colors.card,
    borderTopWidth: Shape.borderWidth,
    borderBottomWidth: Shape.borderWidth,
  },
  rootWithTitle: {
    backgroundColor: Colors.card,
    overflow: 'visible',
    paddingTop: Shape.spacing(2),
    borderTopWidth: Shape.borderWidth,
    borderBottomWidth: Shape.borderWidth,
    borderColor: Colors.border,
  },
  titleViewStyle: {
    ...Styles.border,
    position: 'absolute',
    zIndex: 3000,
    borderWidth: Shape.borderWidth,
    borderColor: Colors.border,
    height: 40,
    backgroundColor: 'white',
    left: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Shape.spacing(0.5),
    paddingHorizontal: Shape.spacing(1),
    top: -Shape.spacing(2.5),
  },
});

interface ICardProps {
  style?: StyleProp<ViewStyle>;
  title?: string;
}
