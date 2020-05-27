import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { colors, gStyles, shape } from '../assets/styles/Styles';
import LinearGradient from 'react-native-linear-gradient';

interface TextAlertProps {
  text: string;
  state: boolean;
}

const TextAlert: React.FC<TextAlertProps> = ({ text, state }) => {
  if (state) {
    return (
      <LinearGradient colors={['#388e3c', '#1b5e20']} style={styles.container}>
        <View style={styles.insideContainer}>
          <AntDesign
            name="check" size={shape.iconSize - 10}
            style={styles.iconStyle}
          />
          <View>
            <Text style={styles.text}>
              {text}
            </Text>
          </View>
        </View>
      </LinearGradient>
    );
  } return null;
};

export default TextAlert;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: shape.spacing(),
    paddingHorizontal: shape.spacing(2),
  },
  insideContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: shape.spacing(),
    paddingRight: shape.spacing(3),
  },
  iconStyle: {
    marginTop: 5,
    marginRight: 10,
    color: '#263238',
  },
  text: {
    ...gStyles.normalText,
    color: 'white',
  },
});
