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
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import usersBack from '../assets/images/usersBack.png';
import {
  setAllUsers,
  removeFromAllUsers,
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
  modalButtons: {
    fontFamily: 'FontNormalFD',
    marginLeft: 10,
    marginRight: 10,
  },
  modalTitle: {
    fontFamily: 'FontBold',
    fontSize: 18,
  },
  modalDescription: {
    fontFamily: 'FontNormal',
    fontSize: 15,
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
  _id: string;
  firstName: string;
  lastName: string;
  personelNumber: string;
  identificationNumber: string;
  phoneNumber: string;
}

interface TableState {
  data: Row[];
}

const DELETE_USER = gql`
mutation DeleteUser($id: ID!){
  deleteUser(id: $id){
    _id
  }
}
`;
const GET_ALL_USERS = gql`
query GetUsers(
  $information: String,
  $page: Int,
  $limit: Int,
){
  users(
    information: $information,
    page: $page,
    limit: $limit,
  ){
    users{
      _id,
      firstName,
      lastName,
      personelNumber,
      identificationNumber,
      phoneNumber,
    }
    quantity
  }
}
`;

interface SnackState {
  message: string;
  severity: 'success' | 'error';
}

const ManageAllUsers: React.FC<PendingProps> = (props) => {
  const { loading, error, data } = useQuery(GET_ALL_USERS, {
    variables: {
      information: '',
      page: 1,
      limit: 4,
    },
  });
  const [openSnack, setOpenSnack] = useState(false);
  const [snackOption, setSnackOption] = useState<SnackState>({ message: '', severity: "success" });
  const [open, setOpen] = React.useState(false);
  const [currentUseridToDelete, setCurrentUseridToDelete] = useState('');
  const openSnackbar = () => {
    setOpenSnack(true);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const closeSnackbar = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false);
  };
  const classes = useStyles();
  const {
    allUsers,
    removeFromAllUsers,
    setAllUsers,
  } = props;
  useEffect(() => {
    if (data) {
      console.log(data);
      setAllUsers(data.users.users);
    }
  }, [data, setAllUsers]);
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
    <Mutation mutation={DELETE_USER}
      onCompleted={(data: any) => {
        console.log(data);
        setSnackOption({
          message: 'کاربر با موفقیت حذف شد',
          severity: 'success',
        })
        openSnackbar();
        removeFromAllUsers(data.authenticateUser._id)
      }}
      onError={(error: any) => {
        setSnackOption({
          message: 'مشکلی در حذف کردن کابر به وجود آمده است، لطفا دوباره تلاش کنید',
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
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              padding: 40,
              backgroundImage: `url(${usersBack})`,
              backgroundSize: '100% 100%',
              direction: 'rtl',
            }}
          >
            <Modal
              aria-labelledby="modal-title"
              aria-describedby="delete-modal-description"
              className={classes.modal}
              open={open}
              onClose={handleClose}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={open}>
                <Box className={classes.paper}>
                  <Box className={classes.modalTitle}>
                    هشدار
                </Box>
                  <Box className={classes.modalDescription}>
                    آیا از حذف این کاربر به طور کامل اطمینان دارید؟
                </Box>
                  <Box style={{
                    alignSelf: 'center',
                    marginTop: 10,
                  }}>
                    <Button className={classes.modalButtons} onClick={handleClose}>
                      بازگشت
                  </Button>
                    <Button
                      onClick={() => {
                        console.log('ine:', currentUseridToDelete);
                        deleteUser({ variables: { id: currentUseridToDelete } });
                        handleClose();
                      }}
                      className={classes.modalButtons}
                      style={{ backgroundColor: 'red', color: 'white' }}>
                      ادامه
                  </Button>
                  </Box>
                </Box>
              </Fade>
            </Modal>
            <Snack open={openSnack} message={snackOption.message} severity={snackOption.severity} onClose={closeSnackbar} />
            {allUsers.length !== 0 && <Box
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginBottom: 30,
                fontFamily: 'FontNormal',
              }}
            >
              لیست کاربران تایید شده
          </Box>}
            {allUsers.length === 0 ?
              <Box style={{
                display: 'flex',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'FontNormal'
              }}>
                در حال حاضر کاربری وجود ندارد
            </Box> : <TableContainer component={Paper}
              >
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableHeader}>نام</TableCell>
                      <TableCell className={classes.tableHeader} align="center">نام‌خانوادگی</TableCell>
                      <TableCell className={classes.tableHeader} align="center">شماره پرسنلی</TableCell>
                      <TableCell className={classes.tableHeader} align="center">کدملی</TableCell>
                      <TableCell className={classes.tableHeader} align="center">شماره تلفن</TableCell>
                      <TableCell className={classes.tableHeader} align="center">حذف کاربران</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allUsers.map((row, index) => (
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
                            style={{ backgroundColor: '#d32f2f' }}
                            onClick={() => {
                              setCurrentUseridToDelete(row._id);
                              handleOpen();
                            }}
                          >
                            <DeleteForeverRoundedIcon style={{ color: 'white' }} />
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
}

const mapState = ({ mainData }: any) => ({
  allUsers: mainData.allUsers,
})

export default connect(mapState, {
  setAllUsers,
  removeFromAllUsers,
})(ManageAllUsers);

interface PendingProps {
  setAllUsers: (users: Array<userType>) => void;
  removeFromAllUsers: (id: string) => void;
  allUsers: Array<userType>;
}
