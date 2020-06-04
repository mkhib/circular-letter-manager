import React from 'react';
import gql from 'graphql-tag';
import * as yup from 'yup';
import { useMutation } from '@apollo/react-hooks';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextInput from '../components/TextInput';
import { Mutation } from '@apollo/react-components';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import { logoutWithoutChangeRoute } from '../redux/slices/user';
import Link from '@material-ui/core/Link';
import {
  setAnything,
  clearPersonelNumber,
  clearAnyThing,
} from '../redux/slices/user';
import { login, setPersonelNumber, setPassword, setErrors } from '../redux/slices/user';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Alert, AlertTitle } from '@material-ui/lab';
import {
  setGraphqlError,
  clearGraphqlError,
} from '../redux/slices/data';
import loginBack from '../assets/images/loginBack.jpg'
var CryptoJS = require('react-native-crypto-js');

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
  logoutWithoutChangeRoute: any;
}

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
  }
}
`;

const LOGOUT = gql`
mutation Logout{
  logout
}
`;

let schema = yup.object().shape({
  personelNumber: yup.string().required('شماره پرسنلی وارد نشده است.'),
  password: yup.string().required('رمزعبور وارد نشده است.'),
});

const Login: React.FunctionComponent<LoginProps> = (props) => {
  const [
    logout,
    { loading: logoutLoading, error: logoutnError },
  ] = useMutation(LOGOUT);
  const {
    personelNumber,
    password,
    setAnything,
    logoutWithoutChangeRoute,
  } = props;
  const classes = useStyles();

  React.useEffect(() => {
    logout();
    logoutWithoutChangeRoute();
  }, [logout, logoutWithoutChangeRoute]);


  const onSubmit = (history: any, firstName: string, lastName: string, isAdmin: boolean, id: string, changedPassword: boolean) => {
    const { login } = props;
    login({
      personelNumber,
      id,
      isAdmin,
      firstName,
      lastName,
      changedPassword,
    }, history);
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
  return (<Mutation
    mutation={LOGIN}
    onError={(err: any) => {
      props.setGraphqlError(err);
    }}
  >
    {(login: any, { data, error, loading }: any) => {
      const onRealLogin = () => {
        let cipherPass = CryptoJS.AES.encrypt(password, key).toString();
        login({
          variables: {
            data: {
              personelNumber: personelNumber,
              password: cipherPass
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
          console.log(data);
          onSubmit(history, data.login.user.firstName, data.login.user.lastName, data.login.user.isAdmin, data.login.user._id, data.login.user.changedPassword);
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
            <Link
              href="forgot-password"
              style={{
                marginBottom: 10,
              }}
            >
              <Box style={{
                display: 'flex',
                flexDirection: 'row',
                fontFamily: 'FontNormal',
                fontSize: 14,
              }}>
                رمزعبور خود را فراموش کرده‌اید؟
              </Box>
            </Link>
            <SubmitButton />
            <Link
              href="download-app"
              style={{
                marginBottom: 10,
              }}
            >
              <Box style={{
                display: 'flex',
                flexDirection: 'row',
                fontFamily: 'FontNormal',
                fontSize: 14,
              }}>
                دانلود اپلیکیشن اندروید
              </Box>
            </Link>
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
    checked,
    authenticated
  } = state.session;
  const {
    graphqlError,
  } = state.mainData;
  return {
    checked,
    authenticated,
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
  logoutWithoutChangeRoute,
  clearGraphqlError,
  setPersonelNumber,
  setPassword,
  setAnything,
  setGraphqlError,
  clearAnyThing,
  clearPersonelNumber,
})(Login);
