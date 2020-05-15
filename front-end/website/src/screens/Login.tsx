import React, { forwardRef, useRef, useImperativeHandle } from 'react';
import gql from 'graphql-tag';
import * as yup from 'yup';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextInput from '../components/TextInput';
import { Mutation } from '@apollo/react-components';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import {
  setAnything,
  clearPersonelNumber,
  clearAnyThing,
} from '../redux/slices/user';
import { login, setPersonelNumber, setPassword, setErrors } from '../redux/slices/user';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Alert, AlertTitle } from '@material-ui/lab';
import {
  setAnyThing,
  setGraphqlError,
  clearGraphqlError,
} from '../redux/slices/data';
import loginBack from '../assets/images/loginBack.jpg'
var aes256 = require('aes256');

const useStyles = makeStyles(theme => ({
  button: {
    marginBottom: 15,
    // marginLeft: 20,
    fontFamily: 'FontNormalFD',
  },
  titleBox: {
    fontFamily: 'FontNormalFD',
    marginBottom: 20,
  },
}));

interface LoginProps {
  personelNumber: string;
  password: string;
  setAnything: any;
  location: any;
  history: any;
  user: string;
  login: any;
  errors: Array<string>;
  setGraphqlError: any;
  graphqlError: any;
  setErrors: any;
  clearGraphqlError: any;
}

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
    }
    token
  }
}
`;

let schema = yup.object().shape({
  personelNumber: yup.string().required('شماره پرسنلی وارد نشده است.'),
  password: yup.string().required('رمزعبور وارد نشده است.'),
});

const Login: React.FunctionComponent<LoginProps> = (props) => {
  const {
    personelNumber,
    password,
    setAnything,
    location,
    user,
  } = props;
  const classes = useStyles();

  const saveTokens = (token: any) => {
    localStorage.setItem('token', token ? token : '');
  }

  const onSubmit = (history: any, token: string, firstName: string, lastName: string) => {
    const { login } = props;
    login({
      personelNumber,
      password,
      token,
      firstName,
      lastName,
    }, history);
    saveTokens(token);
  }

  const errorCheck = (name: string) => {
    let hasError = false;
    props.errors.forEach((errorName) => {
      if (name === errorName) {
        hasError = true;
      }
    });
    return hasError;
  }

  const handleErrorMessage = (message: string) => {
    if (message === 'Network error: Failed to fetch') {
      return '.لطفا اتصال خود به اینترنت را بررسی کنید'
    } else {
      return '.نام‌کاربری یا رمز عبور نادرست است'
    }
  }

  const renderError = (error: any) => {
    if (props.graphqlError.message) {
      return (
        <Alert severity="error" style={{ marginBottom: 20, fontFamily: 'FontNormal' }}>
          <AlertTitle style={{ fontFamily: 'FontNormal' }}>
            خطا
          </AlertTitle>
          {handleErrorMessage(props.graphqlError.message)}
        </Alert>
      );
    }
  }
  const key = 'wopakeiowp@9403-092i4qwoskidCFAfdowkidrf[$%otp0[awos[dfaswoawrAWDW%&^&*^REWSR#$@^$TREbeqwaE';
  const cipher = aes256.createCipher(key);
  return (<Mutation
    mutation={LOGIN}
    onError={(err: any) => {
      props.setGraphqlError(err);
    }}
  >
    {(login: any, { data, error, loading }: any) => {
      const onRealLogin = () => {
        login({
          variables: {
            data: {
              personelNumber: parseInt(personelNumber, 10),
              // password: cipher.encrypt(password)
              password: password
            },
          },
        });
      };
      const validateAndLogin = () => {
        props.clearGraphqlError();
        schema.validate({
          personelNumber,
          password,
        }, {
          abortEarly: false
        }).then(() => {
          props.setErrors([]);
          onRealLogin();
        }).catch((e: any) => {
          props.setErrors(e.inner);
        });
      }
      const SubmitButton = withRouter(({ history }) => {
        if (data) {
          onSubmit(history, data.login.token, data.login.user.firstName, data.login.user.lastName);
        }
        return (
          <Button
            className={classes.button}
            variant="outlined"
            color="primary"
            onClick={validateAndLogin}
          >
            {loading ? <CircularProgress style={{ height: 24, width: 24 }} /> : 'ورود'}
          </Button>
        );
      });
      return (
        <Box style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: `url(${loginBack})`,
        }}>
          <Box style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            paddingLeft: 100,
            paddingRight: 100,
            flex: 1,
          }}>
            <Box className={classes.titleBox}>
              به سامانه بارگذاری و جست و جو بخشنامه‌ها خوش‌آمدید
            </Box>
            {renderError(error)}
            <TextInput
              id="personelNumber"
              label="شماره پرسنلی"
              error={errorCheck('personelNumber')}
              value={personelNumber}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setAnything({
                  theThing: 'personelNumber',
                  data: event.target.value,
                });
              }}
              onKeyUp={(e: any) => {
                const enterCode = 13;
                if (e.which === enterCode) {
                  validateAndLogin();
                }
              }}
            />
            <TextInput
              id="password"
              label="رمزعبور"
              error={errorCheck('password')}
              type="password"
              value={password}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAnything({
                theThing: 'password',
                data: event.target.value
              })}
              onKeyUp={(e: any) => {
                const enterCode = 13;
                if (e.which === enterCode) {
                  validateAndLogin();
                }
              }}
            />
            <SubmitButton />
          </Box>
        </Box>
      )
    }}
  </Mutation>
  );
}

const mapStateToProps = (state: any) => {
  const {
    personelNumber,
    password,
    errors,
    user,
  } = state.userData;
  const {
    graphqlError,
  } = state.mainData;
  return {
    personelNumber,
    graphqlError,
    password,
    errors,
    user,
  };
};

export default connect(mapStateToProps, {
  login,
  setErrors,
  clearGraphqlError,
  setPersonelNumber,
  setPassword,
  setAnything,
  setGraphqlError,
  clearAnyThing,
  clearPersonelNumber,
})(Login);
