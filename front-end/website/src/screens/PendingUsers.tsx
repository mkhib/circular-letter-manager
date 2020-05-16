import React, { useState, useEffect, forwardRef } from 'react';
import gql from 'graphql-tag';
import {
  Redirect,
  useLocation,
} from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Check from '@material-ui/icons/Check';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable, { Column } from 'material-table';
import { useQuery } from '@apollo/react-hooks';
import { Mutation } from '@apollo/react-components';

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
}));

interface Row {
  firstName: string;
  lastName: string;
  personelNumber: string;
  identificationNumber: string;
  phoneNumber: string;
}

interface TableState {
  columns: Array<Column<Row>>;
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
  authenticateUser(id: $id)
}
`;
const tableIcons = {
  Check: forwardRef((props: any, ref: any) => <Check {...props} ref={ref} />),
};

const PendingUsers = () => {
  const { loading, error, data } = useQuery(GET_PENDING_USERS);
  const classes = useStyles();
  const [state, setState] = React.useState<TableState>({
    columns: [
      { title: 'نام', field: 'firstName' },
      { title: 'نام‌خانوادگی', field: 'lastName' },
      { title: 'شماره پرسنلی', field: 'personelNumber' },
      { title: 'کدملی', field: 'identificationNumber' },
    ],
    data: [
      {
        firstName: 'Mehmet',
        lastName: 'Baran',
        personelNumber: '1987',
        identificationNumber: '63',
        phoneNumber: '09132261342',
      },
    ],
  });
  if (error) {
    if (error.message === 'GraphQL error: Authentication required') {
      return (<Redirect to={{
        pathname: '/login',
      }} />)
    }
  }
  if (data) {
    var usersData = data;
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
    <Mutation mutation={AUTHORISE_USER}>
      {(authenticateUser: any, { loading }: any) => {
        const renderUsers = (users: {
          id: string;
          firstName: string;
          lastName: string;
          personelNumber: string;
          identificationNumber: string;
          phoneNumber: string;
        }) => {
          return (
            <Box>

            </Box>
          );
        }
        return (
          <Box
            style={{
              padding: 40,
            }}
          >
            <MaterialTable
              columns={state.columns}
              data={state.data}
              title="Demo Title"
            />
          </Box>
        );
      }}
    </Mutation>
  );
}

export default PendingUsers;
