import React, { FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { gStyles, shape } from '../assets/styles/Styles';

interface LockTheAppProps {
  link: string;
}

const LockTheApp: FC<LockTheAppProps> = ({ link }) => {
  return (
    <LinearGradient colors={['#7986cb', '#5c6bc0', '#3f51b5', '#3949ab', '#303f9f', '#283593']}
      style={styles.liniearView}
    >
      <View
        style={styles.container}
      >
        <Text style={styles.textStyle}>
          شما در حال استفاده از یک نسخه قدیمی از برنامه هستید، لطفا برنامه خود را به روز رسانی کنید.
      </Text>
        <View
          style={{
            marginTop: shape.spacing(3),
          }}
        >
          <TouchableOpacity
            style={gStyles.button}
            onPress={async () => {
              await Linking.openURL(link);
            }}
          >
            <Text
              style={StyleSheet.flatten([styles.textStyle, { fontSize: 18 }])}
            >
              دانلود نسخه جدید برنامه
          </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default LockTheApp;

const styles = StyleSheet.create({
  liniearView: {
    flex: 1,
  },
  textStyle: {
    ...gStyles.normalText,
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  container: {
    ...gStyles.container,
    justifyContent: 'center',
    alignItems: 'center',
    padding: shape.spacing(),
  },
});
