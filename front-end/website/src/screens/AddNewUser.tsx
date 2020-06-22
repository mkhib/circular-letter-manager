import React from 'react';
import gql from 'graphql-tag';
import * as yup from 'yup';
import { useMutation } from '@apollo/react-hooks';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextInput from '../components/TextInput';
import { Mutation } from '@apollo/react-components';
import { makeStyles, withStyles, Theme, } from '@material-ui/core/styles';
import { withRouter, Redirect } from 'react-router-dom';
import { login, setPersonelNumber, setPassword, setErrors } from '../redux/slices/user';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Alert, AlertTitle } from '@material-ui/lab';
import {
  setGraphqlError,
  clearGraphqlError,
  clearAnyThing,
  setAnyThing,
} from '../redux/slices/data';
import loginBack from '../assets/images/loginBack.jpg';
import Snack from '../components/Snack';
import Radio, { RadioProps } from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
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
  radioLabel: {
    fontFamily: 'FontNormalFD',
  },
}));

interface AddNewUserProps {
  newUsername: string;
  newUserLastName: string;
  newUserIdentificationCode: string;
  newUserPersonelNumber: string;
  newUserPhoneNumber: string;
  setAnyThing: any;
  clearAnyThing: any;
  location: any;
  history: any;
  user: string;
  errors: Array<string>;
  setGraphqlError: any;
  graphqlError: any;
  setErrors: any;
  clearGraphqlError: any;
}

interface SnackState {
  message: string;
  severity: 'success' | 'error';
}


const CREATE_USER = gql`
mutation CreateUser(
  $firstName: String!,
  $lastName: String!,
  $personelNumber: String!,
  $identificationNumber: String!,
  $phoneNumber: String!,
  $isAdmin: Boolean!,
){
  adminSignUp(
  firstName: $firstName,
  lastName: $lastName,
  personelNumber: $personelNumber,
  identificationNumber: $identificationNumber,
  phoneNumber: $phoneNumber,
  isAdmin: $isAdmin,
  )
}
`;

let schema = yup.object().shape({
  newUsername: yup.string().required('نام وارد نشده است'),
  newUserLastName: yup.string().required('نام‌خانوادگی وارد نشده است'),
  newUserPersonelNumber: yup.string().required('شماره پرسنلی وارد نشده است'),
  newUserPhoneNumber: yup.string().matches(/^(09)\d+/, 'شماره وارد شده صحیح نیست').length(11, 'شماره تلفن باید 11 رقم باشد').required('شماره تلفن همراه وارد نشده است'),
  newUserIdentificationCode: yup
    .string()
    .transform((v) => (v ? v : undefined))
    .test("", "کد ملی وارد شده معتبر نمی‌باشد", (value) => {
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
    }).required('کدملی وارد نشده است'),
});

const ChangePassword: React.FunctionComponent<AddNewUserProps> = (props) => {
  const {
    setAnyThing,
    clearAnyThing,
    newUsername,
    newUserLastName,
    newUserIdentificationCode,
    newUserPersonelNumber,
    newUserPhoneNumber,
  } = props;
  const classes = useStyles();
  const [errs, setErrs] = React.useState([]);
  const [isUserAdmin, setIsUserAdmin] = React.useState('normalUser');
  const [openSnack, setOpenSnack] = React.useState(false);
  const [snackOption, setSnackOption] = React.useState<SnackState>({ message: '', severity: "success" })
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

  const handleUserType = () => {
    if (isUserAdmin === 'normalUser') {
      return false;
    } if (isUserAdmin === 'adminUser') {
      return true;
    }
  }

  const handleErrorMessage = (message: string) => {
    if (message === 'Network error: Failed to fetch') {
      return '.لطفا اتصال خود به اینترنت را بررسی کنید'
    } else if (message === 'GraphQL error: Duplicate personelNumber!') {
      return '.کاربری با این شماره پرسنلی قبلا ثبت‌نام کرده است'
    } else if (message === 'GraphQL error: Duplicate IdentificationNumber!') {
      return '.کاربری با این کدملی قبلا ثبت‌نام کرده است'
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
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsUserAdmin((event.target as HTMLInputElement).value);
  };

  const StyledFormControlLabel = withStyles((theme: Theme) => ({
    label: {
      fontFamily: 'FontNormalFD',
    },
  }))(FormControlLabel);

  return (<Mutation
    mutation={CREATE_USER}
    onCompleted={() => {
      clearAnyThing({
        theThing: 'newUsername',
      });
      clearAnyThing({
        theThing: 'newUserLastName',
      });
      clearAnyThing({
        theThing: 'newUserIdentificationCode',
      });
      clearAnyThing({
        theThing: 'newUserPersonelNumber',
      });
      clearAnyThing({
        theThing: 'newUserPhoneNumber',
      });
      setSnackOption({
        message: 'کاربر با موفقیت ایجاد شد و رمز عبور برای شماره همراه ایشان پیامک گردید',
        severity: 'success',
      });
      openSnackbar();
    }}
    onError={(err: any) => {
      if (err.message === 'GraphQL error: Authentication required') {
        return (<Redirect to={{
          pathname: '/login',
        }} />)
      }
      setSnackOption({
        message: 'ایجاد کاربر جدید با مشکل مواجه شد',
        severity: 'error',
      });
      openSnackbar();
      props.setGraphqlError(err);
    }}
  >
    {(adminSignUp: any, { data, error, loading }: any) => {
      const onCreateNewUser = () => {
        adminSignUp({
          variables: {
            firstName: newUsername,
            lastName: newUserLastName,
            personelNumber: fixNumbers(newUserPersonelNumber),
            identificationNumber: fixNumbers(newUserIdentificationCode),
            phoneNumber: fixNumbers(newUserPhoneNumber),
            isAdmin: handleUserType(),
          },
        });
      };
      const validateAndCreateUser = () => {
        props.clearGraphqlError();
        schema.validate({
          newUsername,
          newUserLastName,
          newUserIdentificationCode: fixNumbers(newUserIdentificationCode),
          newUserPersonelNumber: fixNumbers(newUserPersonelNumber),
          newUserPhoneNumber: fixNumbers(newUserPhoneNumber),
        }, {
          abortEarly: false
        }).then(() => {
          props.setErrors([]);
          setErrs([]);
          onCreateNewUser();
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
            onClick={validateAndCreateUser}
          >
            {loading ? <CircularProgress style={{ height: 24, width: 24 }} /> : 'ادامه'}
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
            <Snack open={openSnack} autoHideDuration={15000} message={snackOption.message} severity={snackOption.severity} onClose={closeSnackbar} />
            <Box className={classes.titleBox}>
              مشخصات کاربر را وارد نمایید
            </Box>
            {renderError(error)}
            <FormControl style={{ alignSelf: 'flex-end', marginRight: 10, }} component="fieldset">
              <FormLabel style={{ fontFamily: 'FontNormal' }} component="legend">نوع کاربر</FormLabel>
              <RadioGroup
                style={{ fontFamily: 'FontNormal' }}
                aria-label="نوع کاربر"
                name="userType"
                value={isUserAdmin}
                onChange={handleChange}>
                <StyledFormControlLabel
                  value="normalUser"
                  className={classes.radioLabel}
                  control={<Radio />}
                  label="کاربر عادی"
                  labelPlacement="start"
                />
                <StyledFormControlLabel
                  value="adminUser"
                  control={<Radio />}
                  label="مدیر سیستم"
                  labelPlacement="start"
                />
              </RadioGroup>
            </FormControl>
            <TextInput
              id="newUsername"
              label="نام"
              error={errorCheck('newUsername')}
              helperText={findErr('newUsername')}
              value={newUsername}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setAnyThing({
                  theThing: 'newUsername',
                  data: event.target.value
                })
              }}
              onKeyUp={(e: any) => {
                const enterCode = 13;
                if (e.which === enterCode) {
                  validateAndCreateUser();
                }
              }}
            />
            <TextInput
              id="newUserLastName"
              label="نام‌خانوادگی"
              error={errorCheck('newUserLastName')}
              helperText={findErr('newUserLastName')}
              value={newUserLastName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setAnyThing({
                  theThing: 'newUserLastName',
                  data: event.target.value
                })
              }}
              onKeyUp={(e: any) => {
                const enterCode = 13;
                if (e.which === enterCode) {
                  validateAndCreateUser();
                }
              }}
            />
            <TextInput
              id="newUserIdentificationCode"
              label="کدملی"
              error={errorCheck('newUserIdentificationCode')}
              helperText={findErr('newUserIdentificationCode')}
              value={newUserIdentificationCode}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setAnyThing({
                  theThing: 'newUserIdentificationCode',
                  data: event.target.value
                })
              }}
              onKeyUp={(e: any) => {
                const enterCode = 13;
                if (e.which === enterCode) {
                  validateAndCreateUser();
                }
              }}
            />
            <TextInput
              id="newUserPersonelNumber"
              label="شماره پرسنلی"
              error={errorCheck('newUserPersonelNumber')}
              helperText={findErr('newUserPersonelNumber')}
              value={newUserPersonelNumber}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setAnyThing({
                  theThing: 'newUserPersonelNumber',
                  data: event.target.value
                })
              }}
              onKeyUp={(e: any) => {
                const enterCode = 13;
                if (e.which === enterCode) {
                  validateAndCreateUser();
                }
              }}
            />
            <TextInput
              id="newUserPhoneNumber"
              label="شماره همراه"
              error={errorCheck('newUserPhoneNumber')}
              helperText={findErr('newUserPhoneNumber')}
              value={newUserPhoneNumber}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setAnyThing({
                  theThing: 'newUserPhoneNumber',
                  data: event.target.value
                })
              }}
              onKeyUp={(e: any) => {
                const enterCode = 13;
                if (e.which === enterCode) {
                  validateAndCreateUser();
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
    errors,
    user,
  } = state.userData;
  const {
    checked,
    authenticated
  } = state.session;
  const {
    graphqlError,
    newUsername,
    newUserLastName,
    newUserIdentificationCode,
    newUserPersonelNumber,
    newUserPhoneNumber,
  } = state.mainData;
  return {
    checked,
    authenticated,
    graphqlError,
    errors,
    user,
    newUsername,
    newUserLastName,
    newUserIdentificationCode,
    newUserPersonelNumber,
    newUserPhoneNumber,
  };
};

export default connect(mapStateToProps, {
  setErrors,
  clearGraphqlError,
  setPersonelNumber,
  setPassword,
  setAnyThing,
  setGraphqlError,
  clearAnyThing,
})(ChangePassword);
