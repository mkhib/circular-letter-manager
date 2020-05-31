import React, { useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, TouchableWithoutFeedback } from 'react-native';
import { gql } from 'apollo-boost';
import * as yup from 'yup';
import AsyncStorage from '@react-native-community/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Actions } from 'react-native-router-flux';
import { useMutation } from '@apollo/react-hooks';
import LinearGradient from 'react-native-linear-gradient';
import { FloatingTitleTextInputField } from '../components/floating_title_text_input_field';
import { colors, gStyles, shape } from '../assets/styles/Styles';
import TextAlert from '../components/TextAlert';
import Loading from '../components/Loading';
var CryptoJS = require('react-native-crypto-js');
const key = 'wopakeiowp@9403-092i4qwoskidCFAfdowkidrf[$%otp0[awos[dfaswoawrAWDW%&^&*^REWSR#$@^$TREbeqwaE';

const LOGIN = gql`
mutation Login(
 $data: LoginUserInput!){
  login(
  data: $data,
  ){
    user{
      _id
      firstName
      lastName
      isAdmin
      changedPassword
    }
    token
  }
}
`;

interface AlertProps {
  state: boolean;
  message: string;
}

var
  persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
  arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g],
  fixNumbers = function (str: any) {
    if (typeof str === 'string') {
      for (var i = 0; i < 10; i++) {
        str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
      }
    }
    return str;
  };

const schema = yup.object().shape({
  personelNumber: yup.string().required('شماره پرسنلی وارد نشده است.'),
  password: yup.string().required('رمزعبور وارد نشده است.'),
});

const storeData = async (value: string) => {
  try {
    await AsyncStorage.setItem('tok', value);
  } catch (e) {
    // saving error
  }
};

const Login = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [login, { data, loading, error }] = useMutation(LOGIN);
  const [errorState, setErrorState] = useState<AlertProps>({ state: false, message: '' });
  const [errors, setErrors] = useState<yup.ValidationError | null>(null);
  const passwordRef = useRef<TextInput>(null);
  React.useEffect(() => {
    const storeTok = async () => {
      if (data) {
        await storeData(data.login.token);
        if (data.login.user.changedPassword) {
          setTimeout(() => Actions.main(), 0);
        } else {
          setTimeout(() => Actions.changePasswordLock(), 0);
        }
      }
    }
    if (data) {
      storeTok();
    }
    if (error) {
      console.log(error.message)
      if (error.message === 'Network error: Failed to fetch' || error.message === 'Network error: Unexpected token T in JSON at position 0') {
        setErrorState({
          message: 'اتصال خود را به اینترنت بررسی کنید.',
          state: true,
        });
      } if (error.message === 'GraphQL error: Unauthorized user!') {
        setErrorState({
          message: 'حساب کاربری شما هنوز تایید نشده است.',
          state: true,
        });
      } else {
        setErrorState({
          message: 'نام‌کاربری یا رمز عبور نادرست است.',
          state: true,
        });
      }
    }
  }, [error, data]);

  const clearErrors = () => {
    setErrorState({ message: '', state: false });
    setErrors(null);
  };
  const validateAndLogin = () => {
    clearErrors();
    schema.validate({
      personelNumber: fixNumbers(username),
      password,
    }, { abortEarly: false }).then(() => {
      onRealLogin();
    }).catch((e: yup.ValidationError) => {
      setErrors(e);
    });
  };
  const onRealLogin = () => {
    let cipherPass = CryptoJS.AES.encrypt(fixNumbers(password), key).toString();
    login({
      variables: {
        data: {
          personelNumber: fixNumbers(username),
          password: cipherPass,
        },
      },
    });
  };
  const handleHelperText = (name: string) => {
    let helperText = '';
    errors?.inner.forEach((err) => {
      if (err.path === name) {
        helperText = err.message;
      } return true;
    });
    return helperText;
  };

  return (
    <LinearGradient colors={['#7986cb', '#5c6bc0', '#3f51b5', '#3949ab', '#303f9f', '#283593']} style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        style={gStyles.container}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.titleText}>
            به سامانه جست و جو در بخشنامه‌ها خوش‌آمدید
        </Text>
        </View>
        <View>
          <TextAlert text={errorState.message} state={errorState.state} />
        </View>
        <View style={styles.inputsView}>
          <View>
            <FloatingTitleTextInputField
              attrName="personelNumber"
              title="شماره پرسنلی"
              helperText={handleHelperText('personelNumber')}
              value={username}
              returnKeyLabel="go"
              returnKeyType="go"
              onSubmitEditing={() => {
                passwordRef.current?.focus();
              }}
              onChangeText={(text: string) => {
                setUsername(text);
              }
              }
            />
          </View>
          <View>
            <FloatingTitleTextInputField
              attrName="password"
              forwardedRef={passwordRef}
              helperText={handleHelperText('password')}
              title="رمزعبور"
              secureTextEntry
              onSubmitEditing={() => {
                validateAndLogin();
              }}
              value={password}
              onChangeText={(text: string) => {
                setPassword(text);
              }
              }
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            clearErrors();
            Actions.forgotPassword();
          }}
        >
          <Text style={styles.forgotPasswordText}>
            رمزعبور خود را فراموش کرده‌اید؟
        </Text>
        </TouchableOpacity>
        <View>
          <TouchableOpacity
            style={[StyleSheet.flatten([gStyles.button, styles.button])]}
            onPress={() => {
              validateAndLogin();
            }}
          >
            <Text style={styles.buttonText}>
              ورود
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            clearErrors();
            Actions.signup();
          }}
        >
          <Text style={styles.forgotPasswordText}>
            ثبت‌نام
        </Text>
        </TouchableOpacity>
        {loading &&
          <Loading />
        }
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    ...gStyles.container,
    justifyContent: 'center',
    alignItems: 'center',
    padding: shape.spacing(),
  },
  lottieContainer: {
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
    position: 'absolute',
    bottom: 50,
    height: 200,
    width: 200,
  },
  titleText: {
    ...gStyles.boldText,
    color: 'white',
    marginBottom: shape.spacing(2),
  },
  forgotPasswordText: {
    ...gStyles.normalText,
    marginVertical: shape.spacing(),
    color: 'white',
  },
  inputsView: {
    width: '100%',
  },
  button: {
    marginTop: shape.spacing(),
  },
  buttonText: {
    ...gStyles.normalText,
    color: 'white',
  },
});
