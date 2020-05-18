import { StyleSheet } from 'react-native';
export const colors = {
  red: '#c62828',
  blue: '#2196f3',
  indigo: '#3f51b5',
  grey: '#9e9e9e',
  lightGrey: '#e0e0e0',
  black: '#212121',
  background: '#f5f5f5',
};

export const shape = {
  borderRadius: 7,
  spacing: (number) => {
    if (number) {
      return number * 10;
    } return 10;
  },
};

export const gStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  normalText: {
    fontFamily: 'Vazir-FD',
    fontSize: 15,
  },
  boldText: {
    fontFamily: 'Vazir-Bold-FD',
    fontSize: 15,
  },
  placeholderText: {
    fontFamily: 'Vazir-FD',
  },
  textInput: {
    fontFamily: 'Vazir-FD',
    fontSize: 15,
    marginBottom: shape.spacing(),
    backgroundColor: 'white',
    width: '100%',
  },
});
