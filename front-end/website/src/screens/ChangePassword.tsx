import React, { forwardRef, useRef, useImperativeHandle } from 'react';
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
  oldPassword: string;
  newPassword: string;
  againNewPassword: string;
  setAnything: any;
  location: any;
  history: any;
  user: string;
  errors: Array<string>;
  setGraphqlError: any;
  graphqlError: any;
  setErrors: any;
  clearGraphqlError: any;
}

const CHANGE_THAT_PASSWORD = gql`
mutation ChangePassword($data: PasswordInput!){
  changePassword(data: $data)
}
`;

let schema = yup.object().shape({
  oldPassword: yup.string().required('رمزعبور قبلی وارد نشده است'),
  newPassword: yup.string().min(8, 'رمزعبور جدید باید حداقل 8 کاراکتر باشد').required('رمزعبور جدید وارد نشده است'),
  againNewPassword: yup.string().min(8, 'تکرار رمزعبور باید حداقل 8 کاراکتر باشد').required('تکرار رمزعبور وارد نشده است').oneOf([yup.ref('newPassword')], 'تکرار رمزعبور جدید منطبق نیست')
});

const ChangePassword: React.FunctionComponent<LoginProps> = (props) => {
  const {
    setAnything,
    oldPassword,
    newPassword,
    againNewPassword,
    location,
  } = props;
  const classes = useStyles();
  const [errs, setErrs] = React.useState([]);

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
    } if (message === 'GraphQL error: Wrong password!') {
      return '.رمزعبور قبلی نادرست است'
    }
    else {
      return '.مشکلی پیش آمده است'
    }
  }

  const findErr = (name: string) => {
    let errorMessage = '';
    if (errs.length > 0) {
      errs.forEach((error: any) => {
        if (error.params.path === name) {
          errorMessage = error.message;
          return true;
        }
      });
      return errorMessage;
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
    mutation={CHANGE_THAT_PASSWORD}
    onError={(err: any) => {
      props.setGraphqlError(err);
    }}
  >
    {(changePassword: any, { data, error, loading }: any) => {
      const onChangePassword = () => {
        changePassword({
          variables: {
            data: {
              oldPassword: cipher.encrypt(oldPassword),
              newPassword: cipher.encrypt(newPassword),
            },
          },
        });
      };
      const validateAndLogin = () => {
        props.clearGraphqlError();
        schema.validate({
          oldPassword,
          newPassword,
          againNewPassword,
        }, {
          abortEarly: false
        }).then(() => {
          props.setErrors([]);
          onChangePassword();
        }).catch((e: any) => {
          setErrs(e.inner);
          props.setErrors(e.inner);
        });
      }
      const SubmitButton = withRouter(({ history }) => {
        return (
          <Button
            className={classes.button}
            variant="outlined"
            color="primary"
            onClick={validateAndLogin}
          >
            {loading ? <CircularProgress style={{ height: 24, width: 24 }} /> : 'تغییر رمزعبور'}
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
              تغییر رمز عبور
            </Box>
            {renderError(error)}
            <TextInput
              id="oldPassword"
              label="رمزعبور قبلی"
              error={errorCheck('oldPassword')}
              type="password"
              helperText={findErr('oldPassword')}
              value={oldPassword}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAnything({
                theThing: 'oldPassword',
                data: event.target.value
              })}
              onKeyUp={(e: any) => {
                const enterCode = 13;
                if (e.which === enterCode) {
                  validateAndLogin();
                }
              }}
            />
            <TextInput
              id="newPassword"
              label="رمزعبور جدید"
              error={errorCheck('newPassword')}
              type="password"
              helperText={findErr('newPassword')}
              value={newPassword}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAnything({
                theThing: 'newPassword',
                data: event.target.value
              })}
              onKeyUp={(e: any) => {
                const enterCode = 13;
                if (e.which === enterCode) {
                  validateAndLogin();
                }
              }}
            />
            <TextInput
              id="againNewPassword"
              label="تکرار رمزعبور جدید"
              error={errorCheck('againNewPassword')}
              helperText={findErr('againNewPassword')}
              type="password"
              value={againNewPassword}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAnything({
                theThing: 'againNewPassword',
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
    oldPassword,
    newPassword,
    againNewPassword,
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
    graphqlError,
    errors,
    user,
    oldPassword,
    newPassword,
    againNewPassword,
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
})(ChangePassword);
