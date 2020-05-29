import React, { useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
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
import SuccessTextAlert from '../components/SuccessTextAlert';
import Loading from '../components/Loading';

interface AlertProps {
  state: boolean;
  message: string;
}

const SIGNUP = gql`
mutation Signup(
  $firstName: String!,
  $lastName: String!,
  $personelNumber: String!,
  $identificationNumber: String!,
  $phoneNumber: String!,
){
  userSignUp(
    firstName: $firstName,
    lastName: $lastName,
    personelNumber: $personelNumber,
    identificationNumber: $identificationNumber,
    phoneNumber: $phoneNumber,
  )
}
`;

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
  name: yup.string().required('نام وارد نشده است.'),
  lastName: yup.string().required('نام‌خانوادگی وارد نشده است.'),
  personelNumber: yup.string().required('شماره پرسنلی وارد نشده است.'),
  phoneNumber: yup.string().matches(/^(09)\d+/, 'شماره وارد شده صحیح نیست.').length(11, 'شماره تلفن باید 11 رقم باشد.').required('شماره تلفن همراه وارد نشده است.'),
  identificationNumber: yup
    .string()
    .transform((v) => (v ? v : undefined))
    .test("", "کد ملی وارد شده معتبر نمی‌باشد.", (value) => {
      if (
        !/^\d{10}$/.test(value) ||
        value === "0000000000" ||
        value === "1111111111" ||
        value === "2222222222" ||
        value === "3333333333" ||
        value === "4444444444" ||
        value === "5555555555" ||
        value === "6666666666" ||
        value === "7777777777" ||
        value === "8888888888" ||
        value === "9999999999"
      ) {
        return false;
      } else {
        const check = parseInt(value[9], 10);
        let sum = 0;
        let i;
        for (i = 0; i < 9; ++i) {
          sum += parseInt(value[i], 10) * (10 - i);
        }
        sum %= 11;
        return (sum < 2 && check === sum) || (sum >= 2 && check + sum === 11);
      }
    }).required('کدملی وارد شده است.'),
});


const Signup = () => {
  const [name, setName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [identificationNumber, setIdentificationNumber] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [userSignUp, { data, loading, error }] = useMutation(SIGNUP, {
    onCompleted: () => {
      setSuccessState({
        message: 'مشخصات شما با موفقیت ثبت شد و پس از تایید آن توسط مدیر سیستم رمزعبور برای شما پیامک خواهد شد.',
        state: true,
      });
    }
  });
  const [errorState, setErrorState] = useState<AlertProps>({ state: false, message: '' });
  const [errors, setErrors] = useState<yup.ValidationError | null>(null);
  const lastNameRef = useRef<TextInput>(null);
  const personelNumberRef = useRef<TextInput>(null);
  const phoneNumberRef = useRef<TextInput>(null);
  const [successState, setSuccessState] = useState<AlertProps>({ state: false, message: '' });
  const identificationNumberRef = useRef<TextInput>(null);
  React.useEffect(() => {
    if (error) {
      console.log(error.message);
      if (error.message === 'Network error: Failed to fetch' || error.message === 'Network error: Unexpected token T in JSON at position 0') {
        setErrorState({
          message: 'اتصال خود را به اینترنت بررسی کنید.',
          state: true,
        });
      } else {
        setErrorState({
          message: 'نام‌کاربری یا رمز عبور نادرست است.',
          state: true,
        });
      }
    }
  }, [error]);

  const clearErrors = () => {
    setErrorState({ message: '', state: false });
    setSuccessState({ message: '', state: false });
    setErrors(null);
  };
  const validateAndSignup = () => {
    clearErrors();
    schema.validate({
      name,
      lastName,
      phoneNumber: fixNumbers(phoneNumber),
      personelNumber: fixNumbers(username),
      identificationNumber: fixNumbers(identificationNumber),
    }, { abortEarly: false }).then(() => {
      onRealLogin();
    }).catch((e: yup.ValidationError) => {
      setErrors(e);
    });
  };
  const onRealLogin = () => {
    userSignUp({
      variables: {
        firstName: name,
        lastName,
        personelNumber: fixNumbers(username),
        identificationNumber: fixNumbers(identificationNumber),
        phoneNumber: fixNumbers(phoneNumber),
      },
    });
  };
  const handleHelperText = (n: string) => {
    let helperText = '';
    errors?.inner.forEach((err) => {
      if (err.path === n) {
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
            مشخصات خواسته شده را وارد نمایید.
          </Text>
        </View>
        <View>
          <TextAlert text={errorState.message} state={errorState.state} />
          <SuccessTextAlert state={successState.state} text={successState.message} />
        </View>
        <View style={styles.inputsView}>
          <View>
            <FloatingTitleTextInputField
              attrName="name"
              title="نام"
              helperText={handleHelperText('name')}
              value={name}
              returnKeyLabel="go"
              returnKeyType="go"
              onSubmitEditing={() => {
                lastNameRef.current?.focus();
              }}
              onChangeText={setName}
            />
          </View>
          <View>
            <FloatingTitleTextInputField
              attrName="lastName"
              title="نام‌خانوادگی"
              forwardedRef={lastNameRef}
              helperText={handleHelperText('lastName')}
              value={lastName}
              returnKeyLabel="go"
              returnKeyType="go"
              onSubmitEditing={() => {
                identificationNumberRef.current?.focus();
              }}
              onChangeText={setLastName}
            />
          </View>
          <View>
            <FloatingTitleTextInputField
              attrName="identificationNumber"
              title="کدملی"
              forwardedRef={identificationNumberRef}
              helperText={handleHelperText('identificationNumber')}
              value={identificationNumber}
              returnKeyLabel="go"
              returnKeyType="go"
              onSubmitEditing={() => {
                personelNumberRef.current?.focus();
              }}
              onChangeText={setIdentificationNumber}
            />
          </View>
          <View>
            <FloatingTitleTextInputField
              attrName="personelNumber"
              title="شماره پرسنلی"
              forwardedRef={personelNumberRef}
              helperText={handleHelperText('personelNumber')}
              value={username}
              returnKeyLabel="go"
              returnKeyType="go"
              onSubmitEditing={() => {
                phoneNumberRef.current?.focus();
              }}
              onChangeText={setUsername}
            />
          </View>
          <View>
            <FloatingTitleTextInputField
              attrName="phoneNumber"
              title="شماره تلفن همراه"
              forwardedRef={phoneNumberRef}
              helperText={handleHelperText('phoneNumber')}
              value={phoneNumber}
              returnKeyLabel="go"
              returnKeyType="go"
              onSubmitEditing={() => {
                validateAndSignup();
              }}
              onChangeText={setPhoneNumber}
            />
          </View>
        </View>
        <View>
          <TouchableOpacity
            style={[StyleSheet.flatten([gStyles.button, styles.button])]}
            onPress={() => {
              Keyboard.dismiss();
              validateAndSignup();
            }}
          >
            <Text style={styles.buttonText}>
              ثبت‌نام
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            clearErrors();
            Actions.pop();
          }}
        >
          <Text style={styles.forgotPasswordText}>
            بازگشت
        </Text>
        </TouchableOpacity>
        {loading &&
          <Loading />
        }
      </KeyboardAwareScrollView>
    </LinearGradient>
  );
};

export default Signup;

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
