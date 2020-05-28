import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { gql } from 'apollo-boost';
import * as yup from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Actions } from 'react-native-router-flux';
import { useMutation } from '@apollo/react-hooks';
import LinearGradient from 'react-native-linear-gradient';
import { FloatingTitleTextInputField } from '../components/floating_title_text_input_field';
import { colors, gStyles, shape } from '../assets/styles/Styles';
import SuccessTextAlert from '../components/SuccessTextAlert';
import TextAlert from '../components/TextAlert';
import Loading from '../components/Loading';


const FORGOT_PASSWORD = gql`
mutation ForgetPassword($personelNumber:String!){
  forgotPassword(personelNumber: $personelNumber)
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
});

const ForgotPassword = () => {
  const [username, setUsername] = useState<string>('');
  const [forgotPassword, { data, loading, error }] = useMutation(FORGOT_PASSWORD, {
    onCompleted: () => {
      setSuccessState({
        message: 'رمزعبور موقت برای شما پیامک شد.',
        state: true,
      });
    },
  });
  const [errorState, setErrorState] = useState<AlertProps>({ state: false, message: '' });
  const [successState, setSuccessState] = useState<AlertProps>({ state: false, message: '' });
  const [errors, setErrors] = useState<yup.ValidationError | null>(null);
  React.useEffect(() => {
    if (error) {
      console.log(error.message);
      if (error.message === 'Network error: Failed to fetch' || error.message === 'Network error: Unexpected token T in JSON at position 0') {
        setErrorState({
          message: 'اتصال خود را به اینترنت بررسی کنید.',
          state: true,
        });
      } else if (error.message === "GraphQL error: Cannot read property 'id' of null") {
        setErrorState({
          message: 'شماره پرسنلی نادرست است.',
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
  const clearErrors = () => {
    setSuccessState({ message: '', state: false });
    setErrorState({ message: '', state: false });
    setErrors(null);
  };

  const validateAndSendForgetPasswordRequest = () => {
    clearErrors();
    schema.validate({
      personelNumber: username,
    }, { abortEarly: false }).then(() => {
      onRealLogin();
    }).catch((e: yup.ValidationError) => {
      setErrors(e);
    });
  };
  const onRealLogin = () => {
    forgotPassword({
      variables: {
        personelNumber: fixNumbers(username),
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
      colors={['#7986cb', '#5c6bc0', '#3f51b5', '#3949ab', '#303f9f', '#283593']}
      style={styles.linearGradientStyle}
    >
      <KeyboardAwareScrollView
        style={gStyles.container}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={styles.titleText}>
            برای ادامه شماره پرسنلی خود را وارد نمایید.
          </Text>
        </View>
        <View>
          <TextAlert text={errorState.message} state={errorState.state} />
          <SuccessTextAlert state={successState.state} text={successState.message} />
        </View>
        <View style={styles.inputsView}>
          <View>
            <FloatingTitleTextInputField
              attrName="personelNumber"
              title="شماره پرسنلی"
              helperText={handleHelperText('personelNumber')}
              value={username}
              onSubmitEditing={() => { validateAndSendForgetPasswordRequest() }}
              onChangeText={setUsername}
            />
          </View>
        </View>
        <View>
          <TouchableOpacity
            style={[StyleSheet.flatten([gStyles.button, styles.button])]}
            onPress={() => {
              validateAndSendForgetPasswordRequest();
            }}
          >
            <Text style={styles.buttonText}>
              ادامه
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            Actions.pop();
          }}
        >
          <Text style={styles.goBackText}>
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

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    ...gStyles.container,
    justifyContent: 'center',
    alignItems: 'center',
    padding: shape.spacing(),
  },
  linearGradientStyle: {
    flex: 1,
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
  titleText: {
    ...gStyles.boldText,
    color: 'white',
    marginBottom: shape.spacing(2),
  },
  goBackText: {
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
