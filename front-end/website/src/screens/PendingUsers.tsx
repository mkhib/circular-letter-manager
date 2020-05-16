import React, { useState, useEffect, forwardRef } from 'react';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import {
  Redirect,
  useLocation,
} from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Check from '@material-ui/icons/Check';
import Clear from '@material-ui/icons/ClearRounded';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles, withStyles, Theme, createStyles } from '@material-ui/core/styles';
import MaterialTable, { Column } from 'material-table';
import { useQuery } from '@apollo/react-hooks';
import { Mutation } from '@apollo/react-components';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {
  setPendingUsers,
  removeFromPendingUsers,
  userType,
} from '../redux/slices/data';
import Snack from '../components/Snack';
import './table.css'

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    fontFamily: 'FontNormalFD',
    flexDirection: 'column',
    alignItems: 'flex-end',
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  snackStyle: {
    fontFamily: 'FontNormal',
  },
  snackBox: {
    marginLeft: 20,
    marginRight: 20,
  },
  table: {
    minWidth: 650,
    fontFamily: 'FontNormalFD',
  },
  tableHeader: {
    fontFamily: 'FontNormal'
  },
  tableCells: {
    fontFamily: 'FontNormalFD',
  },
}));

interface Row {
  id: string;
  firstName: string;
  lastName: string;
  personelNumber: string;
  identificationNumber: string;
  phoneNumber: string;
}

interface TableState {
  data: Row[];
}

const GET_PENDING_USERS = gql`
query GetPendingUsers{
  unauthenticatedUsers{
    id
    firstName
    lastName
    personelNumber
    identificationNumber
    phoneNumber
  }
}
`;

const AUTHORISE_USER = gql`
mutation AuthoriseUser($id: ID!){
  authenticateUser(id: $id){
    id
  }
}
`;

const REJECT_AND_DELETE_USER = gql`
mutation RejectAndDelete($id: ID!){
  deleteUser(id: $id){
    id
  }
}
`;
interface SnackState {
  message: string;
  severity: 'success' | 'error';
}

const PendingUsers: React.FC<PendingProps> = (props) => {
  const { loading, error, data } = useQuery(GET_PENDING_USERS);
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
  const classes = useStyles();
  const {
    pendingUsers,
    setPendingUsers,
    removeFromPendingUsers,
  } = props;
  useEffect(() => {
    if (data) {
      setPendingUsers(data.unauthenticatedUsers);
    }
  }, [data, setPendingUsers]);
  if (error) {
    if (error.message === 'GraphQL error: Authentication required') {
      return (<Redirect to={{
        pathname: '/login',
      }} />)
    }
  }
  if (loading) {
    return (<Box style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    }}>
      <Backdrop className={classes.backdrop} open>
        <CircularProgress style={{ height: '8vmax', width: '8vmax' }} />
      </Backdrop>
    </Box>)
  }
  return (
    <Mutation mutation={REJECT_AND_DELETE_USER}
      onCompleted={(data: any) => {
        console.log(data);
        setSnackOption({
          message: 'درخواست شما با موفقیت انجام شد',
          severity: 'success',
        })
        openSnackbar();
        removeFromPendingUsers(data.deleteUser.id);
      }}
      onError={(error: any) => {
        setSnackOption({
          message: 'مشکلی در ردکردن کابر به وجود آمده است، لطفا دوباره تلاش کنید',
          severity: 'error',
        })
        openSnackbar();
      }}
    >
      {(deleteUser: any, { loading }: any) => {
        if (loading) {
          return (<Box style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}>
            <Backdrop className={classes.backdrop} open>
              <CircularProgress style={{ height: '8vmax', width: '8vmax' }} />
            </Backdrop>
          </Box>)
        }
        return (
          <Mutation mutation={AUTHORISE_USER}
            onCompleted={(data: any) => {
              console.log(data);
              setSnackOption({
                message: 'کاربر با موفقیت تایید شد و پیامک رمزعبور برای ایشان ارسال گردید',
                severity: 'success',
              })
              openSnackbar();
              removeFromPendingUsers(data.authenticateUser.id)
            }}
            onError={(error: any) => {
              setSnackOption({
                message: 'مشکلی در تایید کردن کابر به وجود آمده است، لطفا دوباره تلاش کنید',
                severity: 'error',
              })
              openSnackbar();
            }}
          >
            {(authenticateUser: any, { loading }: any) => {
              if (loading) {
                return (<Box style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}>
                  <Backdrop className={classes.backdrop} open>
                    <CircularProgress style={{ height: '8vmax', width: '8vmax' }} />
                  </Backdrop>
                </Box>)
              }
              return (
                <Box
                  style={{
                    padding: 40,
                    direction: 'rtl',
                  }}
                >
                  <Snack open={openSnack} message={snackOption.message} severity={snackOption.severity} onClose={closeSnackbar} />
                  {pendingUsers.length !== 0 && <Box
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      marginBottom: 30,
                      fontFamily: 'FontNormal',
                    }}
                  >
                    لیست کاربران درحال انتظار برای تایید
                  </Box>}
                  {pendingUsers.length === 0 ? <Box style={{ fontFamily: 'FontNormal' }}>در حال حاضر کاربری وجود ندارد</Box> : <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.tableHeader}>نام</TableCell>
                          <TableCell className={classes.tableHeader} align="center">نام‌خانوادگی</TableCell>
                          <TableCell className={classes.tableHeader} align="center">شماره پرسنلی</TableCell>
                          <TableCell className={classes.tableHeader} align="center">کدملی</TableCell>
                          <TableCell className={classes.tableHeader} align="center">شماره تلفن</TableCell>
                          <TableCell className={classes.tableHeader} align="center">تایید کاربران</TableCell>
                          <TableCell className={classes.tableHeader} align="center">ردکردن کاربران</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pendingUsers.map((row, index) => (
                          <TableRow key={index.toString()}>
                            <TableCell className={classes.tableCells} component="th" scope="row">
                              {row.firstName}
                            </TableCell>
                            <TableCell className={classes.tableCells} align="center">{row.lastName}</TableCell>
                            <TableCell className={classes.tableCells} align="center">{row.personelNumber}</TableCell>
                            <TableCell className={classes.tableCells} align="center">{row.identificationNumber}</TableCell>
                            <TableCell className={classes.tableCells} align="center">{row.phoneNumber}</TableCell>
                            <TableCell className={classes.tableCells} align="center">
                              <Button
                                variant="contained"
                                onClick={() => {
                                  authenticateUser({ variables: { id: row.id } });
                                }}
                              >
                                <Check />
                              </Button>
                            </TableCell>
                            <TableCell className={classes.tableCells} align="center">
                              <Button
                                variant="contained"
                                style={{ backgroundColor: '#d32f2f' }}
                                onClick={() => {
                                  deleteUser({ variables: { id: row.id } });
                                }}
                              >
                                <Clear style={{ color: 'white' }} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>}
                </Box>
              );
            }}
          </Mutation>
        );
      }}
    </Mutation>
  );
}

const mapState = ({ mainData }: any) => ({
  pendingUsers: mainData.pendingUsers,
})

export default connect(mapState, {
  setPendingUsers,
  removeFromPendingUsers,
})(PendingUsers);

interface PendingProps {
  setPendingUsers: (users: Array<userType>) => void;
  removeFromPendingUsers: (id: string) => void;
  pendingUsers: Array<userType>;
}
