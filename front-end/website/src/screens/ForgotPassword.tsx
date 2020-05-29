import React, { useState } from 'react';
import gql from 'graphql-tag';
import * as yup from 'yup';
import { useMutation } from '@apollo/react-hooks';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextInput from '../components/TextInput';
import { Mutation } from '@apollo/react-components';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import { logoutWithoutChangeRoute } from '../redux/slices/user';
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
import Snack from '../components/Snack';
import loginBack from '../assets/images/loginBack.jpg'

const useStyles = makeStyles(theme => ({
  button: {
    marginBottom: 15,
    fontFamily: 'FontNormalFD',
  },
  titleBox: {
    fontFamily: 'FontNormalFD',
    marginBottom: 20,
  },
}));
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
interface LoginProps {
  personelNumber: string;
  setAnything: any;
  location: any;
  user: string;
  login: any;
  errors: Array<string>;
  setGraphqlError: any;
  graphqlError: any;
  setErrors: any;
  clearGraphqlError: any;
  logoutWithoutChangeRoute: any;
}

const FORGOT_PASSWORD = gql`
mutation ForgotPassword($personelNumber: String!){
forgotPassword(personelNumber: $personelNumber)
}
`;

let schema = yup.object().shape({
  personelNumber: yup.string().required('شماره پرسنلی وارد نشده است.'),
});
interface SnackState {
  message: string;
  severity: 'success' | 'error';
}
const ForgotPassword: React.FunctionComponent<LoginProps> = (props) => {
  const {
    personelNumber,
    setAnything,
  } = props;
  const classes = useStyles();
  const [openSnack, setOpenSnack] = useState(false);
  const [snackOption, setSnackOption] = useState<SnackState>({ message: '', severity: "success" })
  const openSnackbar = () => {
    setOpenSnack(true);
  };
  const closeSnackbar = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false);
  };

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
    } if (message === 'GraphQL error: User not found!') {
      return '.شماره پرسنلی وارد شده نادرست است';
    } if (message === 'GraphQL error: User is not authorized!') {
      return '.حساب کاربری شما هنوز تایید نشده است';
    } else {
      return '.مشکلی پیش‌آمده است'
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
  return (<Mutation
    mutation={FORGOT_PASSWORD}
    onCompleted={() => {
      setSnackOption({
        message: 'رمزعبور برای شماره همراه شما پیامک شد پس از ورود از صفحه حساب کاربری اقدام به تغییر رمزعبور خود نمایید',
        severity: 'success',
      });
      openSnackbar();
    }}
    onError={(err: any) => {
      console.log(err.message);
      props.setGraphqlError(err);
    }}
  >
    {(forgotPassword: any, { data, error, loading }: any) => {
      const onForgotPassword = () => {
        forgotPassword({
          variables: {
            personelNumber: fixNumbers(personelNumber),
          },
        });
      };
      const validateAndContinue = () => {
        props.clearGraphqlError();
        schema.validate({
          personelNumber,
        }, {
          abortEarly: false
        }).then(() => {
          props.setErrors([]);
          onForgotPassword();
        }).catch((e: any) => {
          props.setErrors(e.inner);
        });
      }
      return (
        <Box style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: `url(${loginBack})`,
        }}>
          <Snack
            open={openSnack}
            message={snackOption.message}
            severity={snackOption.severity}
            autoHideDuration={30000}
            onClose={closeSnackbar} />
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
              برای ادامه، شماره پرسنلی خود را وارد نمایید
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
                  validateAndContinue();
                }
              }}
            />
            <Link
              href="login"
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
              ورود به حساب کاربری
              </Box>
            </Link>
            <Button
              className={classes.button}
              variant="outlined"
              color="primary"
              onClick={validateAndContinue}
            >
              {loading ? <CircularProgress style={{ height: 24, width: 24 }} /> : 'ادامه'}
            </Button>
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
})(ForgotPassword);
