import { StyleSheet } from 'react-native';
export const colors = {
  red: '#c62828',
  blue: '#2196f3',
  indigo: '#3f51b5',
  grey: '#9e9e9e',
  lightGrey: '#e0e0e0',
  black: '#212121',
  background: '#f5f5f5',
  placeholder: '#424242',
  redAlert: '#ffea00',
};

export const shape = {
  borderRadius: 3,
  iconSize: 35,
  spacing: (number) => {
    if (number) {
      return number * 10;
    } return 10;
  },
};

export const gStyles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: colors.background,
  },
  normalText: {
    fontFamily: 'Vazir-FD',
    fontSize: 16,
  },
  boldText: {
    fontFamily: 'Vazir-Bold-FD',
    fontSize: 17,
  },
  placeholderText: {
    fontFamily: 'Vazir-FD',
  },
  textInput: {
    fontFamily: 'Vazir-FD',
    fontSize: 16,
    textAlign: 'right',
    paddingRight: shape.spacing(),
    marginBottom: shape.spacing(),
    backgroundColor: 'white',
    width: '100%',
  },
  button: {
    paddingHorizontal: shape.spacing(5),
    borderRadius: shape.borderRadius,
    backgroundColor: colors.blue,
    paddingVertical: shape.spacing(),
  },
});
