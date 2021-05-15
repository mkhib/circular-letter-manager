import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, gStyles, shape } from '../assets/styles/Styles';
import LinearGradient from 'react-native-linear-gradient';

interface TextAlertProps {
  text: string;
  state: boolean;
}

const TextAlert: React.FC<TextAlertProps> = ({ text, state }) => {
  if (state) {
    return (
      <LinearGradient colors={['#ffa726', '#e65100']} style={styles.container}>
        <View style={styles.container}>
          <MaterialCommunityIcons
            name="alert-outline"
            size={shape.iconSize - 5}
            style={styles.iconStyle} />
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
    width:'100%',
    marginBottom: shape.spacing(),
    paddingHorizontal: shape.spacing(2),
  },
  iconStyle: {
    marginBottom: 0,
    marginRight: 10,
    color: '#263238',
  },
  text: {
    ...gStyles.normalText,
    color: 'white',
  },
});
