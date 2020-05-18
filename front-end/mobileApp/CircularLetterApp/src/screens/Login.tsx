import React, { useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, gStyles, shape } from '../assets/styles/Styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Login = () => {
  const [username, setUsername] = useState<string>('');
  const passwordRef = useRef<TextInput>(null);
  return (
    <KeyboardAwareScrollView
      style={gStyles.container}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps={'handled'}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.inputsView}>
        <TextInput
          style={gStyles.textInput}
          value={username}
          placeholder="نام‌کاربری"
          returnKeyType="next"
          returnKeyLabel="next"
          onChangeText={(text) => setUsername(text)}
          onSubmitEditing={() => {
            passwordRef.current?.focus();
          }}
        />
        <TextInput
          ref={passwordRef}
          style={gStyles.textInput}
          value={username}
          returnKeyType="go"
          returnKeyLabel="go"
          placeholder="رمزعبور"
          onChangeText={(text) => setUsername(text)}
          onSubmitEditing={() => {
            passwordRef.current?.focus();
          }}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    ...gStyles.container,
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 10,
  },
  inputsView: {
    width: '100%',
  },
});
