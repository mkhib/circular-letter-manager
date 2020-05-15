import React, { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import TextInput from '../components/TextInput';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import DeleteForeverOutlined from '@material-ui/icons/DeleteForeverOutlined';
import { Mutation } from '@apollo/react-components';
import Backdrop from '@material-ui/core/Backdrop';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  setListOfCategories,
  setListOfSubjects,
  addToListOfCategories,
  addToListOfSubjects,
  removeFromListOfCategories,
  removeFromListOfSubjects,
} from '../redux/slices/data';
import { useQuery } from '@apollo/react-hooks';
import webBack from '../assets/images/webBack.jpg'

const CREATE_NEW_CATEGORY = gql`
mutation CreateNewCategory($name: String!){
  createToCategoryType(name: $name){
    id
    name
  }
}
`;

const CREATE_NEW_SUBJECT = gql`
mutation CreateNewSubject($name: String!){
  createSubjectedToType(name: $name){
    id
    name
  }
}
`;

const DELETE_A_CATEGORY = gql`
mutation DeleteACategory($id: ID!){
  deleteToCategoryType(id: $id){
    id
    name
  }
}
`;

const DELETE_A_SUBJECT = gql`
mutation DeleteASubject($id: ID!){
  deleteSubjectedToType(id: $id){
    id
    name
  }
}
`;

export const GET_ALL = gql`
query GetBothLists{
  categoriesQuery{
    subjectedTos { 
      id,
      name 
    },
    toCategories{
      id,
      name
    }
  }
}
`;

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  topContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 100,
    fontFamily: 'FontNormalFD',
  },
  eachItem: {
    fontSize: 17,
  },
  titleDiv: {
    marginBottom: 15,
    marginLeft: 20,
    fontFamily: 'FontNormalFD',
  },
  newBox: {
    display: 'flex',
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
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
}));

const EditSubjectsAndCategories: React.FunctionComponent<IEditProps> = (props) => {
  const [newCategory, setNewCategory] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [open, setOpen] = React.useState(false);
  const [deleteCatSuccess, setDeleteCatSuccess] = useState(false);
  const [deleteCatFailure, setDeleteCatFailure] = useState(false);
  const [deleteSubjSuccess, setDeleteSubjSuccess] = useState(false);
  const [deleteSubjFailure, setDeleteSubjFailure] = useState(false);
  const [addNewCatSuccess, setAddNewCatSuccess] = useState(false);
  const [addNewCatFailure, setAddNewCatFailure] = useState(false);
  const [addNewSubjSuccess, setAddNewSubjSuccess] = useState(false);
  const [addNewSubjFailure, setAddNewSubjFailure] = useState(false);
  const [itemToDelete, setItemToDelete] = useState({ type: '', id: '' });
  const { loading, error, data } = useQuery(GET_ALL);
  const classes = useStyles();
  const { setListOfSubjects, setListOfCategories } = props;
  useEffect(() => {
    if (data) {
      console.log(data);
      setListOfCategories(data.categoriesQuery.toCategories);
      setListOfSubjects(data.categoriesQuery.subjectedTos);
    }
  }, [data, setListOfCategories, setListOfSubjects]);
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
  const openDeleteCatSuccess = () => {
    setDeleteCatSuccess(true);
  };
  const closeDeleteCatSuccess = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setDeleteCatSuccess(false);
  };
  const openDeleteCatFailure = () => {
    setDeleteCatFailure(true);
  };
  const closeDeleteCatFailure = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setDeleteCatFailure(false);
  };
  const openDeleteSubjSuccess = () => {
    setDeleteSubjSuccess(true);
  };
  const closeDeleteSubjSuccess = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setDeleteSubjSuccess(false);
  };
  const openDeleteSubjFailure = () => {
    setDeleteSubjFailure(true);
  };
  const closeDeleteSubjFailure = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setDeleteSubjFailure(false);
  };
  const openAddNewCatSuccess = () => {
    setAddNewCatSuccess(true);
  };
  const closeAddNewCatSuccess = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setAddNewCatSuccess(false);
  };
  const openAddNewCatFailure = () => {
    setAddNewCatFailure(true);
  };
  const closeAddNewCatFailure = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setAddNewCatFailure(false);
  };
  const openAddNewSubjSuccess = () => {
    setAddNewSubjSuccess(true);
  };
  const closeAddNewSubjSuccess = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setAddNewSubjSuccess(false);
  };
  const openAddNewSubjFailure = () => {
    setAddNewSubjFailure(true);
  };
  const closeAddNewSubjFailure = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setAddNewSubjFailure(false);
  };

  // if (loading) {
  //   return (
  //     <Box style={{
  //       display: 'flex',
  //       justifyContent: 'center',
  //       alignItems: 'center',
  //       flex: 1,
  //     }}>
  //       <Backdrop className={classes.backdrop} open>
  //         <CircularProgress style={{ height: '8vmax', width: '8vmax' }} />
  //       </Backdrop>
  //     </Box>
  //   );
  // }
  if (error) {
    return (
      <Box>
        .مشکلی پیش آمده است
      </Box>
    );
  }
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const renderModalItems = (items: Array<{
    id: string;
    name: string;
  }>, type: string) => {
    return items.map((item: {
      id: string;
      name: string;
    }, index: number) => {
      return (
        <Box
          key={index.toString()}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Button
            onClick={() => {
              setItemToDelete({
                id: item.id,
                type
              });
              handleOpen();
            }}
          >
            <DeleteForeverOutlined style={{ width: 30, height: 30 }} />
          </Button>
          {item.name}
        </Box>
      );
    })
  }
  return (
    <Mutation
      mutation={CREATE_NEW_CATEGORY}
      onCompleted={(data: { createToCategoryType: boolean }) => {
        props.addToListOfCategories(data.createToCategoryType);
        openAddNewCatSuccess();
        setNewCategory('');
      }}
      onError={() => {
        openAddNewCatFailure();
      }}
    >
      {(createToCategoryType: any, { data, loading }: any) => {
        var createCategoryLoading = loading;
        return (
          <Mutation mutation={CREATE_NEW_SUBJECT} onCompleted={(data: any) => {
            props.addToListOfSubjects(data.createSubjectedToType);
            openAddNewSubjSuccess();
            setNewSubject('');
          }}
            onError={() => {
              openAddNewSubjFailure();
            }}
          >
            {(createSubjectedToType: any, { data, loading }: any) => {
              var createSubjectLoading = loading;
              return (
                <Mutation mutation={DELETE_A_CATEGORY}
                  onCompleted={(data: any) => {
                    props.removeFromListOfCategories(data.deleteToCategoryType.id);
                    openDeleteCatSuccess();
                  }}
                  onError={() => {
                    openDeleteCatFailure();
                  }}
                >
                  {(deleteToCategoryType: any, { data, loading }: any) => {
                    var deleteCategoryLoading = loading;
                    return (
                      <Mutation mutation={DELETE_A_SUBJECT}
                        onCompleted={(data: any) => {
                          props.removeFromListOfSubjects(data.deleteSubjectedToType.id);
                          openDeleteSubjSuccess();
                        }}
                        onError={() => {
                          openDeleteSubjFailure();
                        }}
                      >
                        {(deleteSubjectedToType: any, { data, loading }: any) => {
                          var deleteSubjectLoading = loading;
                          if (deleteCategoryLoading || deleteSubjectLoading) {
                            return (
                              <Backdrop className={classes.backdrop} open>
                                <CircularProgress style={{ height: '8vmax', width: '8vmax' }} />
                              </Backdrop>
                            );
                          }
                          return (
                            <Box style={{
                              display: 'flex',
                              flex: 1,
                              justifyContent: 'center',
                              backgroundImage: `url(${webBack})`
                            }}>
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
                                      آیا از حذف این مورد اطمینان دارید؟
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
                                          if (itemToDelete.type === 'category') {
                                            deleteToCategoryType({ variables: { id: itemToDelete.id } });
                                          }
                                          if (itemToDelete.type === 'subject') {
                                            deleteSubjectedToType({ variables: { id: itemToDelete.id } })
                                          }
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
                              <Box className={classes.topContainer}>
                                <Box style={{ direction: 'rtl' }}>
                                  <Box>
                                    مقاطع فعلی
                                  </Box>
                                  <Box className={classes.newBox}>
                                    <TextInput
                                      id="newCategory"
                                      label="افزودن مقطع"
                                      value={newCategory}
                                      onKeyUp={(e: any) => {
                                        const enterCode = 13;
                                        if (e.which === enterCode) {
                                          if (!!newCategory) {
                                            createToCategoryType({ variables: { name: newCategory } });
                                          }
                                        }
                                      }}
                                      onChange={(event: any) => {
                                        setNewCategory(event.target.value);
                                      }}
                                    />
                                    <Button
                                      className={classes.titleDiv}
                                      disabled={createCategoryLoading}
                                      variant="outlined"
                                      color="primary"
                                      onClick={() => {
                                        if (!!newCategory) {
                                          createToCategoryType({ variables: { name: newCategory } });
                                        }
                                      }}
                                    >
                                      {createCategoryLoading ? <Box style={{ height: 24, width: 37 }}><CircularProgress style={{ height: 24, width: 24 }} /></Box> : 'افزودن'}
                                    </Button>
                                  </Box>
                                  <Box className={classes.eachItem}>
                                    {renderModalItems(props.listOfCategories, 'category')}
                                  </Box>
                                </Box>
                                <Divider orientation="vertical" style={{ width: 3, marginLeft: 40, marginRight: 40 }} flexItem />
                                <Box style={{ direction: 'rtl' }}>
                                  <Box>
                                    حوزه‌های فعلی
                                  </Box>
                                  <Box className={classes.newBox}>
                                    <TextInput
                                      id="newSubject"
                                      label="افزودن حوزه"
                                      value={newSubject}
                                      onKeyUp={(e: any) => {
                                        const enterCode = 13;
                                        if (e.which === enterCode) {
                                          if (!!newSubject) {
                                            createSubjectedToType({ variables: { name: newSubject } });
                                          }
                                        }
                                      }}
                                      onChange={(event: any) => {
                                        setNewSubject(event.target.value);
                                      }}
                                    />
                                    <Button
                                      className={classes.titleDiv}
                                      disabled={createSubjectLoading}
                                      variant="outlined"
                                      color="primary"
                                      onClick={() => {
                                        if (!!newSubject) {
                                          createSubjectedToType({ variables: { name: newSubject } });
                                        }
                                      }}
                                    >
                                      {createSubjectLoading ? <Box style={{ height: 24, width: 37 }}><CircularProgress style={{ height: 24, width: 24 }} /></Box> : 'افزودن'}
                                    </Button>
                                  </Box>
                                  <Box className={classes.eachItem}>
                                    {renderModalItems(props.listOfSubjects, 'subject')}
                                  </Box>
                                </Box>
                              </Box>
                              <Snackbar open={addNewCatSuccess} autoHideDuration={6000} onClose={closeAddNewCatSuccess}>
                                <Alert className={classes.snackStyle} onClose={closeAddNewCatSuccess} severity="success">
                                  <Box className={classes.snackBox}>
                                    مقطع جدید با موفقیت افزوده شد
                                  </Box>
                                </Alert>
                              </Snackbar>
                              <Snackbar open={addNewCatFailure} autoHideDuration={6000} onClose={closeAddNewCatFailure}>
                                <Alert className={classes.snackStyle} onClose={closeAddNewCatFailure} severity="error">
                                  <Box className={classes.snackBox}>
                                    افزودن مقطع با مشکل مواجه شد لطفا دوباره تلاش کنید
                                  </Box>
                                </Alert>
                              </Snackbar>
                              <Snackbar open={addNewSubjSuccess} autoHideDuration={6000} onClose={closeAddNewSubjSuccess}>
                                <Alert className={classes.snackStyle} onClose={closeAddNewSubjSuccess} severity="success">
                                  <Box className={classes.snackBox}>
                                    حوزه جدید با موفقیت افزوده شد
                                  </Box>
                                </Alert>
                              </Snackbar>
                              <Snackbar open={addNewSubjFailure} autoHideDuration={6000} onClose={closeAddNewSubjFailure}>
                                <Alert className={classes.snackStyle} onClose={closeAddNewSubjFailure} severity="error">
                                  <Box className={classes.snackBox}>
                                    افزودن حوزه با مشکل مواجه شد لطفا دوباره تلاش کنید
                                  </Box>
                                </Alert>
                              </Snackbar>
                              <Snackbar open={deleteCatSuccess} autoHideDuration={6000} onClose={closeDeleteCatSuccess}>
                                <Alert className={classes.snackStyle} onClose={closeDeleteCatSuccess} severity="success">
                                  <Box className={classes.snackBox}>
                                    عملیات حذف با موفقیت انجام شد
                                  </Box>
                                </Alert>
                              </Snackbar>
                              <Snackbar open={deleteCatFailure} autoHideDuration={6000} onClose={closeDeleteCatFailure}>
                                <Alert className={classes.snackStyle} onClose={closeDeleteCatFailure} severity="error">
                                  <Box className={classes.snackBox}>
                                    عملیات حذف مقطع با مشکل مواجه شد لطفا دوباره تلاش کنید
                                  </Box>
                                </Alert>
                              </Snackbar>
                              <Snackbar open={deleteSubjSuccess} autoHideDuration={6000} onClose={closeDeleteSubjSuccess}>
                                <Alert className={classes.snackStyle} onClose={closeDeleteSubjSuccess} severity="success">
                                  <Box className={classes.snackBox}>
                                    عملیات حذف با موفقیت انجام شد
                                  </Box>
                                </Alert>
                              </Snackbar>
                              <Snackbar open={deleteSubjFailure} autoHideDuration={6000} onClose={closeDeleteSubjFailure}>
                                <Alert className={classes.snackStyle} onClose={closeDeleteSubjFailure} severity="error">
                                  <Box className={classes.snackBox}>
                                    عملیات حذف حوزه با مشکل مواجه شد لطفا دوباره تلاش کنید
                                  </Box>
                                </Alert>
                              </Snackbar>
                            </Box>
                          );
                        }}
                      </Mutation>
                    );
                  }}
                </Mutation>
              );
            }}
          </Mutation>
        );
      }}

    </Mutation>
  );
}

const mapState = ({ mainData }: any) => ({
  listOfCategories: mainData.listOfCategories,
  listOfSubjects: mainData.listOfSubjects,
});

export default connect(mapState, {
  setListOfCategories,
  setListOfSubjects,
  addToListOfCategories,
  addToListOfSubjects,
  removeFromListOfCategories,
  removeFromListOfSubjects,
})(EditSubjectsAndCategories);

interface IEditProps {
  listOfCategories: Array<{ name: string, id: string }>;
  listOfSubjects: Array<{ name: string, id: string }>;
  setListOfCategories: any;
  setListOfSubjects: any;
  addToListOfCategories: any;
  addToListOfSubjects: any;
  removeFromListOfCategories: any;
  removeFromListOfSubjects: any;
}
