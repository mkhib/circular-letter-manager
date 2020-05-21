/* eslint-disable prettier/prettier */
import { StyleSheet, Dimensions } from 'react-native';

const primary = 'rgb(67,110,172)';

export const Colors = {
  backgroundColor: '#F1F1F2',
  white: 'rgb(255,255,255)',
  black: 'rgb(35,31,32)',
  blue: '#2B6497',
  lightBlue: '#3f5e96',
  border: '#c8c8c8',
  card: '#fefefe',
  darkGray: '#828282',
  disabled: '#949494',
  error: '#B00020',
  gray: 'rgb(109,110,113)',
  icon: primary,
  lightgrey: 'rgb(235,235,235)',
  midGray: 'rgb(178,179,182)',
  primary,
  red: '#c00000',
  secondary: '#e45e2d',
  text: '#000',
  tintColor: '#2f95dc',
  title: 'rgb(125,125,125)',
  label: 'rgb(110,110,110)',
  placeholder: 'rgba(0,0,0,0.54)',
};

export const Shape = {
  border: {
    raduis: 5,
    width: 0.75,
  },
  borderWithoutRadious: {
    width: 0.75,
  },
  input: {
    height: 55,
  },
  borderRadius: 7,
  borderWidth: 0.75,
  iconSize: 26,
  rowHeight: 50,
  spacingUnit: 10,
  spacing(v = 1) {
    return v * this.spacingUnit;
  },
  touchableOpacity: 0.7,
  flatListContentContainerStyle(empty) {
    if (empty) {
      return Styles.flatListEmptyContainer;
    }
    return Styles.flatListContainer;
  },
};

export const Styles = StyleSheet.create({
  get caption() {
    return {
      ...this.normalText,
      marginBottom: Shape.spacing(1),
      marginTop: Shape.spacing(0.5),
    };
  },
  get placeholder() {
    return {
      ...this.normalText,
      color: Colors.label,
    };
  },
  boldText: {
    fontFamily: 'Samim-Bold-FD',
    fontSize: 16,
  },
  border: {
    borderColor: Colors.border,
    borderRadius: Shape.border.raduis,
    borderWidth: Shape.border.width,
    overflow: 'hidden',
  },
  borderWituoitRadius: {
    borderColor: Colors.border,
    // borderRadius: Shape.border.raduis,
    borderWidth: Shape.border.width,
    overflow: 'hidden',
  },
  normalText: {
    color: Colors.text,
    fontFamily: 'Samim-FD',
    fontSize: isSmallDevice ? 15 : 16,
    fontWeight: 'normal',
  },
  screen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.backgroundColor,
    // paddingHorizontal: Shape.spacing(),
  },
  get titleText() {
    return { ...this.boldText, fontSize: 17 };
  },
  flatListEmptyContainer: {
    flex: 1,
    paddingBottom: Shape.spacing(),
  },
  flatListContainer: {
    paddingBottom: Shape.spacing(0.5),
  },
  flatListColumnWrapper: {
    marginVertical: Shape.spacing(0.5),
    justifyContent: 'space-between',
  },
  textInput: {
    borderWidth: Shape.borderWidth,
    borderRadius: Shape.borderRadius,
    borderColor: Colors.border,
    fontFamily: 'Samim-FD',
    fontSize: isSmallDevice ? 15 : 16,
    padding: Shape.spacing(),
    backgroundColor: Colors.card,
    height: Shape.rowHeight,
    marginTop: Shape.spacing(),
  },
});

const window = Dimensions.get('window');

export const Window = Object.assign(window, {
  width: window.width - Shape.spacing(2),
});

export const isSmallDevice = Window.width < 375;
