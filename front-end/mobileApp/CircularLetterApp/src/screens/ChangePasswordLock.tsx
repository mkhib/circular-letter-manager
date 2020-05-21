import React, { useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, TouchableWithoutFeedback } from 'react-native';
import { gql } from 'apollo-boost';
import * as yup from 'yup';
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
      id
      firstName
      lastName
      isAdmin
      changedPassword
    }
  }
}
`;

const CHANGE_PASSWORD_LOCK = gql`
mutation ChangePasswordLock($password: String!){
  changePasswordOnApp(password: $password)
}
`;

interface AlertProps {
  state: boolean;
  message: string;
}

var
  persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
  arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g],
  fixNumbers = function (str: string) {
    if (typeof str === 'string') {
      for (var i = 0; i < 10; i++) {
        str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
      }
    }
    return str;
  };

const schema = yup.object().shape({
  newPassword: yup.string().min(8, 'رمز عبور جدید باید حداقل 8 کاراکتر باشد.').required('رمزعبور جدید وارد نشده است.'),
  againNewPassword: yup.string().required('تکرار رمزعبور جدید وارد نشده است.').oneOf([yup.ref('newPassword')], 'تکرار رمزعبور جدید منطبق نیست.'),
});
const ChangedPasswordLock = () => {
  const [newPassword, setNewPassword] = useState<string>('');
  const [againNewPassword, setAgainNewPassword] = useState<string>('');
  const [changePasswordOnApp, { data, loading, error }] = useMutation(CHANGE_PASSWORD_LOCK);
  const [errorState, setErrorState] = useState<AlertProps>({ state: false, message: '' });
  const [errors, setErrors] = useState<yup.ValidationError | null>(null);
  const passwordRef = useRef<TextInput>(null);
  React.useEffect(() => {
    if (error) {
      if (error.message === 'Network error: Failed to fetch' || error.message === 'Network error: Unexpected token T in JSON at position 0') {
        setErrorState({
          message: 'اتصال خود را به اینترنت بررسی کنید.',
          state: true,
        });
      } else {
        setErrorState({
          message: 'اتصال خود را به اینترنت بررسی کنید.',
          state: true,
        });
      }
    }
  }, [error]);
  if (data) {
    console.log('change', data);
    setTimeout(() => Actions.main(), 0);
  }
  const clearErrors = () => {
    setErrorState({ message: '', state: false });
    setErrors(null);
  };
  const validateAndLogin = () => {
    clearErrors();
    schema.validate({
      newPassword,
      againNewPassword,
    }, { abortEarly: false }).then(() => {
      onRealChangePassword();
    }).catch((e: yup.ValidationError) => {
      setErrors(e);
    });
  };
  const onRealChangePassword = () => {
    let cipherPass = CryptoJS.AES.encrypt(fixNumbers(newPassword), key).toString();
    changePasswordOnApp({
      variables: {
        password: cipherPass,
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
    <LinearGradient colors={['#42a5f5', '#2196f3', '#1976d2', '#1565c0', '#0d47a1']} style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        style={gStyles.container}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.titleText}>
            برای ادامه دادن یک رمزعبور جدید انتخاب کنید.
        </Text>
        </View>
        <View>
          <TextAlert text={errorState.message} state={errorState.state} />
        </View>
        <View style={styles.inputsView}>
          <View>
            <FloatingTitleTextInputField
              attrName="newPassword"
              forwardedRef={passwordRef}
              helperText={handleHelperText('newPassword')}
              title="رمزعبور جدید"
              secureTextEntry
              onSubmitEditing={() => {
                passwordRef.current?.focus();
              }}
              value={newPassword}
              onChangeText={(text: string) => {
                setNewPassword(text);
              }
              }
            />
          </View>
          <View>
            <FloatingTitleTextInputField
              attrName="againNewPassword"
              forwardedRef={passwordRef}
              helperText={handleHelperText('againNewPassword')}
              title="تکرار رمزعبور جدید"
              secureTextEntry
              onSubmitEditing={() => {
                validateAndLogin();
              }}
              value={againNewPassword}
              onChangeText={(text: string) => {
                setAgainNewPassword(text);
              }
              }
            />
          </View>
        </View>
        <View>
          <TouchableOpacity
            style={[StyleSheet.flatten([gStyles.button, styles.button])]}
            onPress={() => {
              validateAndLogin();
            }}
          >
            <Text style={styles.buttonText}>
              ادامه
          </Text>
          </TouchableOpacity>
        </View>
        {loading &&
          <Loading />
        }
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};

export default ChangedPasswordLock;

const styles = StyleSheet.create({
  container: {
    ...gStyles.container,
    justifyContent: 'center',
    // backgroundColor: colors.indigo,
    alignItems: 'center',
    padding: shape.spacing(),
  },
  lottieContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(33,33,33,0.6)',
    // backgroundColor: 'yellow',
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
    // flex: 1,
    position: 'absolute',
    bottom: 50,
    height: 200,
    width: 200,
    // backgroundColor: colors.indigo,
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
    // height: 50,
  },
  button: {
    marginTop: shape.spacing(),
  },
  buttonText: {
    ...gStyles.normalText,
    color: 'white',
  },
});
