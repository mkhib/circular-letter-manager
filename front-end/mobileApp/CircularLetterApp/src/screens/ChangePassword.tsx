import React, { useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, TouchableWithoutFeedback } from 'react-native';
import { gql } from 'apollo-boost';
import * as yup from 'yup';
import { Actions } from 'react-native-router-flux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useMutation } from '@apollo/react-hooks';
import LinearGradient from 'react-native-linear-gradient';
import { FloatingTitleTextInputField } from '../components/floating_title_text_input_field';
import { colors, gStyles, shape } from '../assets/styles/Styles';
import TextAlert from '../components/TextAlert';
import SuccessTextAlert from '../components/SuccessTextAlert';
import Loading from '../components/Loading';
var CryptoJS = require('react-native-crypto-js');
const key = 'wopakeiowp@9403-092i4qwoskidCFAfdowkidrf[$%otp0[awos[dfaswoawrAWDW%&^&*^REWSR#$@^$TREbeqwaE';

const CHANGE_THAT_PASSWORD = gql`
mutation ChangePassword($data: PasswordInput!){
  changePassword(data: $data)
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
  oldPassword: yup.string().required('رمزعبور قبلی وارد نشده است.'),
  newPassword: yup.string().min(8, 'رمز عبور جدید باید حداقل 8 کاراکتر باشد.').required('رمزعبور جدید وارد نشده است.'),
  againNewPassword: yup.string().required('تکرار رمزعبور جدید وارد نشده است.').oneOf([yup.ref('newPassword')], 'تکرار رمزعبور جدید منطبق نیست.'),
});
const ChangedPassword = () => {
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [againNewPassword, setAgainNewPassword] = useState<string>('');
  const [changePassword, { data, loading, error }] = useMutation(CHANGE_THAT_PASSWORD, {
    onCompleted: () => {
      console.log('here is');
      clearFields();
      setSuccessState({
        message: 'رمزعبور شما با موفقیت تغییر یافت.',
        state: true,
      });
      // setTimeout(() => Actions.main(), 0);
    }
  });
  const [successState, setSuccessState] = useState<AlertProps>({ state: false, message: '' });
  const [errorState, setErrorState] = useState<AlertProps>({ state: false, message: '' });
  const [errors, setErrors] = useState<yup.ValidationError | null>(null);
  const newPasswordRef = useRef<TextInput>(null);
  const againNewPasswordRef = useRef<TextInput>(null);
  React.useEffect(() => {
    if (error) {
      if (error.message === 'Network error: Failed to fetch' || error.message === 'Network error: Unexpected token T in JSON at position 0') {
        setErrorState({
          message: 'اتصال خود را به اینترنت بررسی کنید.',
          state: true,
        });
      } else if (error.message === 'GraphQL error: Wrong password!') {
        setErrorState({
          message: 'رمزعبور قبلی نادرست است.',
          state: true,
        });
      } else {
        console.log('errrr', error.message);
        setErrorState({
          message: 'مشکلی پیش‌آمده است.',
          state: true,
        });
      }
    }
  }, [error]);
  const clearFields = () => {
    setOldPassword('');
    setNewPassword('');
    setAgainNewPassword('');
  }
  const clearErrors = () => {
    setSuccessState({ message: '', state: false });
    setErrorState({
      message: '',
      state: false,
    });
    setErrors(null);
  };
  const validateAndLogin = () => {
    clearErrors();
    schema.validate({
      oldPassword,
      newPassword,
      againNewPassword,
    }, { abortEarly: false }).then(() => {
      onRealChangePassword();
    }).catch((e: yup.ValidationError) => {
      setErrors(e);
    });
  };
  const onRealChangePassword = () => {
    let cipherOldPass = CryptoJS.AES.encrypt(fixNumbers(oldPassword), key).toString();
    let cipherNewPass = CryptoJS.AES.encrypt(fixNumbers(newPassword), key).toString();
    changePassword({
      variables: {
        data: {
          oldPassword: cipherOldPass,
          newPassword: cipherNewPass,
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
    <LinearGradient
      colors={['#42a5f5', '#2196f3', '#1976d2', '#1565c0', '#0d47a1']}
      style={styles.linearStyle}
    >
      <KeyboardAwareScrollView
        style={gStyles.container}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.titleText}>
            تغییر رمزعبور
          </Text>
        </View>
        <View>
          <TextAlert text={errorState.message} state={errorState.state} />
          <SuccessTextAlert state={successState.state} text={successState.message} />
        </View>
        <View style={styles.inputsView}>
          <View>
            <FloatingTitleTextInputField
              attrName="oldPassword"
              helperText={handleHelperText('oldPassword')}
              title="رمزعبور قبلی"
              secureTextEntry
              onSubmitEditing={() => {
                newPasswordRef.current?.focus();
              }}
              value={oldPassword}
              onChangeText={setOldPassword}
            />
          </View>
          <View>
            <FloatingTitleTextInputField
              attrName="newPassword"
              forwardedRef={newPasswordRef}
              helperText={handleHelperText('newPassword')}
              title="رمزعبور جدید"
              secureTextEntry
              onSubmitEditing={() => {
                againNewPasswordRef.current?.focus();
              }}
              value={newPassword}
              onChangeText={setNewPassword}
            />
          </View>
          <View>
            <FloatingTitleTextInputField
              attrName="againNewPassword"
              forwardedRef={againNewPasswordRef}
              helperText={handleHelperText('againNewPassword')}
              title="تکرار رمزعبور جدید"
              secureTextEntry
              onSubmitEditing={validateAndLogin}
              value={againNewPassword}
              onChangeText={setAgainNewPassword}
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
            {/* {loading &&
              <View>
                <Loading />
              </View>
            } */}
          </TouchableOpacity>
          <TouchableOpacity
            style={[StyleSheet.flatten([styles.backButton])]}
            onPress={() => {
              Actions.pop();
            }}
          >
            <Text style={styles.backText}>
              بازگشت
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

export default ChangedPassword;

const styles = StyleSheet.create({
  linearStyle: {
    flex: 1,
  },
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
  backButton: {
    marginTop: shape.spacing(),
    alignItems: 'center',
  },
  buttonText: {
    ...gStyles.normalText,
    color: 'white',
  },
  backText: {
    ...gStyles.normalText,
    color: 'white',
  },
});
