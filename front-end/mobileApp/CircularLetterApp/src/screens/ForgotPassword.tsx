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
import TextAlert from '../components/TextAlert';
import Loading from '../components/Loading';

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
  personelNumber: yup.string().required('شماره پرسنلی وارد نشده است.'),
});

const ForgotPassword = () => {
  const [username, setUsername] = useState<string>('');
  const [login, { data, loading, error }] = useMutation(LOGIN);
  const [errorState, setErrorState] = useState<AlertProps>({ state: false, message: '' });
  const [errors, setErrors] = useState<yup.ValidationError | null>(null);
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
    setTimeout(() => Actions.main(), 0);
  }
  const clearErrors = () => {
    setErrorState({ message: '', state: false });
    setErrors(null);
  };

  const validateAndLogin = () => {
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
    login({
      variables: {
        data: {
          personelNumber: fixNumbers(username),
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
        </View>
        <View style={styles.inputsView}>
          <View>
            <FloatingTitleTextInputField
              attrName="personelNumber"
              title="شماره پرسنلی"
              helperText={handleHelperText('personelNumber')}
              value={username}
              onChangeText={(text: string) => {
                console.log(text);
                setUsername(text);
              }
              }
            />
          </View>
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
