import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import {
  Redirect,
  useLocation,
} from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextInput from '../components/TextInput';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import Pagination from '@material-ui/lab/Pagination';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/react-hooks';
import { Mutation } from '@apollo/react-components';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useApolloClient } from '@apollo/react-hooks';
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
      isAdmin
    }
    quantity
  }
}
`;

interface SnackState {
  message: string;
  severity: 'success' | 'error';
}
function useQueryParam() {
  return new URLSearchParams(useLocation().search);
}
const ManageAllUsers: React.FC<ManageUsersProps> = (props) => {
  const client = useApolloClient();
  let queryParam = useQueryParam();
  const handlePageNumber = () => {
    const page = queryParam.get('page');
    if (page !== null) {
      return parseInt(page, 10);
    } return 1;
  }
  const handleSearch = () => {
    const search = queryParam.get('search')
    if (search !== null) {
      return search;
    } return '';
  }
  const handleUserType = (type: boolean) => {
    if (type) {
      return 'مدیر سیستم';
    } return 'کاربر عادی';
  }
  const { loading, error, data } = useQuery(GET_ALL_USERS, {
    variables: {
      information: handleSearch(),
      page: handlePageNumber(),
      limit: 15,
    },
  });
  const [openSnack, setOpenSnack] = useState(false);
  const [snackOption, setSnackOption] = useState<SnackState>({ message: '', severity: "success" });
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState<string>('');
  const [currentUseridToDelete, setCurrentUseridToDelete] = useState('');
  const doSearch = () => {
    props.history.push(`${window.location.pathname}?page=1&search=${searchValue}`);
  }
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
        setSnackOption({
          message: 'کاربر با موفقیت حذف شد',
          severity: 'success',
        });
        openSnackbar();
        removeFromAllUsers(data.deleteUser._id);
        client.resetStore();
      }}
      onError={(error: any) => {
        if (error.message === 'GraphQL error: Unauthorized action!!!') {
          setSnackOption({
            message: 'نمی‌توانید خودتان را حذف کنید!',
            severity: 'error',
          });
        }
        else {
          setSnackOption({
            message: 'مشکلی در حذف کردن کابر به وجود آمده است، لطفا دوباره تلاش کنید',
            severity: 'error',
          });
        }
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
              backgroundAttachment: 'fixed',
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
            {((allUsers.length === 0 && queryParam.get('search') !== null) || allUsers.length !== 0) && <Box
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginBottom: 30,
                fontFamily: 'FontNormal',
              }}
            >
              لیست کاربران تایید شده
            </Box>}
            {((allUsers.length === 0 && queryParam.get('search') !== null) || allUsers.length !== 0) && (
              <Box style={{
                display: 'flex',
                flexDirection: 'row',
                minWidth: 300,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Box
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginRight: 40,
                    alignItems: 'center',
                  }}
                >
                  <TextInput
                    id="refer to"
                    style={{ width: '25vmax', minWidth: 200, maxWidth: 500, height: 60 }}
                    label="جست و جو کاربران"
                    value={searchValue}
                    onKeyUp={(e: any) => {
                      const enterCode = 13;
                      if (e.which === enterCode) {
                        doSearch();
                      }
                    }}
                    onChange={(event: { target: HTMLInputElement }) => setSearchValue(event.target.value)}
                  />
                  <Button
                    style={{ height: 60, marginBottom: 10, marginRight: 20 }}
                    onClick={() => {
                      doSearch();
                    }}
                  >
                    <SearchOutlinedIcon style={{ fontSize: 40 }} />
                  </Button>
                </Box>
              </Box>
            )}
            {(allUsers.length === 0 && queryParam.get('search') !== null) && (
              <Box style={{
                display: 'flex',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'FontNormal'
              }}>
                کاربری با این مشخصات پیدا نشد
              </Box>
            )}
            {(allUsers.length === 0 && queryParam.get('search') === null) &&
              <Box style={{
                display: 'flex',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'FontNormal'
              }}>
                در حال حاضر کاربری وجود ندارد
            </Box>}
            {
              allUsers.length > 0 && (
                <TableContainer component={Paper}
                >
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableHeader}>نام</TableCell>
                        <TableCell className={classes.tableHeader} align="center">نام‌خانوادگی</TableCell>
                        <TableCell className={classes.tableHeader} align="center">شماره پرسنلی</TableCell>
                        <TableCell className={classes.tableHeader} align="center">کدملی</TableCell>
                        <TableCell className={classes.tableHeader} align="center">شماره تلفن</TableCell>
                        <TableCell className={classes.tableHeader} align="center">نوع کاربر</TableCell>
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
                          <TableCell className={classes.tableCells} align="center">{handleUserType(row.isAdmin)}</TableCell>
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
                </TableContainer>
              )
            }
            <Box style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
              {data.users.quantity !== 0 && <Pagination
                page={handlePageNumber()}
                count={data.users.quantity}
                style={{ direction: 'rtl', marginTop: 20, marginBottom: 40 }}
                color="primary"
                onChange={(_a, b) => {
                  if (handlePageNumber() !== b) {
                    props.history.push(`${window.location.pathname}?page=${b}`)
                  }
                }}
              />}
            </Box>
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

interface ManageUsersProps {
  setAllUsers: (users: Array<userType>) => void;
  removeFromAllUsers: (id: string) => void;
  allUsers: Array<userType>;
  history: any;
}
