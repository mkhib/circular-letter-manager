import React from 'react';
import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';


const Loading = () => {
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback>
        <LottieView
          style={styles.lottieView}
          autoPlay
          loop
          source={require('../assets/animations/loading2.json')}
        />
      </TouchableWithoutFeedback>
    </View>
  );
}

export default Loading;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(33,33,33,0.6)',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 4000,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  lottieView: {
    height: 300,
    width: 300,
  },
});
