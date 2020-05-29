import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  Redirect,
  useLocation,
} from 'react-router-dom';
import { useApolloClient } from '@apollo/react-hooks';
import moment from 'moment';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { withApollo, graphql } from 'react-apollo';
import {
  setAnyThing,
  clearAnyThing,
  setWidth,
  addTag,
  removeTag,
  increamentFileUpload,
  addFile,
  clearGraphqlError,
  removeFilesName,
  clearFiles,
  removeFileUploadStatus,
  removeFile,
  addFileUpload,
  setFileUpload,
  addFilesName,
  setErrors,
  setListOfCategories,
  setListOfSubjects,
} from '../redux/slices/data';
import * as yup from 'yup';
import jMoment from 'moment-jalaali';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextInput from '../components/TextInput';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import DeleteForeverOutlined from '@material-ui/icons/DeleteForeverOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { Mutation } from '@apollo/react-components';
import Tooltip from '@material-ui/core/Tooltip';
import Select from '@material-ui/core/Select';
import UploadOneFile from '../components/UploadOneFile';
import { Colors } from '../assets/base';
import { MenuItem, InputLabel } from '@material-ui/core';
import Stepper from '../components/Stepper';
import DatePicker2 from '../components/DatePicker2';
import Backdrop from '@material-ui/core/Backdrop';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

// const clientWidth = () => {
//   return Math.max(window.innerWidth, document.documentElement.clientWidth) < RESPONSIVE_WIDTH ? 'column' : 'row';
// };

const useStyles = makeStyles(theme => ({
  titleDiv: {
    marginBottom: 15,
    marginLeft: 20,
    fontFamily: 'FontNormalFD',
  },
  fieldTopBox: {
    // flex: 1,
    display: 'flex',
    padding: 40,
    paddingRight: '10vmax',
    paddingLeft: '10vmax',
  },
  rightBoxField: {
    display: 'flex',
    minWidth: 200,
    maxWidth: 210,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  leftBoxField: {
    display: 'flex',
    minWidth: 200,
    maxWidth: 210,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  tagsTopBoxField: {
    display: 'flex',
    minWidth: 250,
    maxWidth: 300,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  tipTool: {
    marginBottom: 15,
    marginLeft: 15,
    fontFamily: 'FontNormalFD'
  },
  tipToolText: {
    fontFamily: 'FontNormalFD',
    textAlign: 'left',
    fontSize: 13,
    padding: 5,
  },
  tagBox: {
    backgroundColor: Colors.darkgrey,
    flexDirection: 'row',
    display: 'flex',
    fontFamily: 'FontNormalFD',
    color: Colors.white,
    fontSize: 17,
    marginLeft: 10,
    padding: 3,
    marginBottom: 10,
  },
  menuItem: {
    fontFamily: 'FontNormal',
    // fontSize: '2.1vmin',
    direction: 'ltr',
  },
  renderTagsBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // alignSelf: 'center',
    width: '100%',
    flexWrap: 'wrap',
    marginRight: 103,
  },
  selectBox: {
    width: '100%',
  },
  select: {
    width: '100%',
    fontFamily: 'FontNormal',
    // fontSize: '2.1vmin',
    marginBottom: 10,
  },
  leftSelect: {
    fontFamily: 'FontNormal',
    // fontSize: '2vmin',
    width: '100%',
    marginBottom: 10,
  },
  tagsWithButtonBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectTopInputLabel: {
    fontFamily: 'FontNormal',
    fontSize: 15,
    marginBottom: 10,
  },
  selectBottomInputLabel: {
    fontFamily: 'FontNormal',
    fontSize: 13,
    textAlign: 'left',
  },
  inpuLabelBox: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  deleteIcon: {
    width: 15,
  },
  checkInfoBox: {
    fontSize: 18,
    marginBottom: 10
  },
  numberCustomInputStyle: {
    fontFamily: 'FontNormalFD',
    direction: 'rtl',
    textAlign: 'right',
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

interface tagProps {
  id: number,
  key: string,
  tag: string,
  onClick: any
}

const DELETE_CIRCULAR_LETTER = gql`
mutation DeleteCirculatLetter($id: ID!){
  deleteCircularLetter(id: $id)
}
`;

const DELETE_WHILE_UPDATE = gql`
mutation DeleteWhileUpdate($id: ID!, $filename: String!){
  deleteFileWhileUpdate(id: $id ,filename: $filename)
}
`;

const Tag = (props: tagProps) => {
  const classes = useStyles();
  return (
    <Box className={classes.tagBox}>
      <DeleteForeverOutlined
        className={classes.deleteIcon}
        onClick={props.onClick}
      />
      {props.tag}
    </Box>
  )
}

const handleTags = (tags: Array<string>) => {
  const tagsToShow: Array<string> = [];
  tags.forEach((tag: string, index: number) => {
    if (index > 0) {
      tagsToShow.push(` - ${tag}`)
    } else {
      tagsToShow.push(`${tag}`)
    }
  });
  return tagsToShow;
}

const toolTipText = `
برای جست و جو در بخشنامه‌ها از این کلمات کلیدی استفاده خواهد شد بعد از وارد کردن هر کلمه بر روی افزودن کلیک کنید
`;
const numberToolTip = `
اگر شماره بخشنامه شامل حروف فارسی است، شماره به صورت عکس مشاهده می‌شود، اما در ثبت شماره به صورت صحیح خللی وارد نمی‌کند
`;
const RESPONSIVE_WIDTH = 800;
const UPLOAD_CIRCULAR_LETTER = gql`
mutation UploadCircular(
 $title:String!,
 $number:String!,
 $referTo:String!,
 $date:String!,
 $from:String!,
 $subjectedTo:String!,
 $importNumber:String,
 $exportNumber:String,
 $toCategory:String!,
 $tags:[String]!,
 $files:[String]!){
  circularLetterInit(
  title: $title,
  number: $number,
  importNumber: $importNumber,
  exportNumber: $exportNumber,
  subjectedTo: $subjectedTo,
  referTo: $referTo,
  date: $date,
  from: $from,
  toCategory: $toCategory,
  tags: $tags,
  files: $files)
}
`;

const DELETE_MULTI_FILES = gql`
mutation DeleteMultiFiles(
  $filenames:[String]!
){
  deleteMultiFiles(filenames: $filenames)
}
`;


const schema = yup.object().shape({
  title: yup.string().required(),
  date: yup.string().required(),
  number: yup.string().required(),
  type: yup.string().required(),
  sender: yup.string().required(),
  toCategory: yup.string().required(),
  subjectedTo: yup.string().required(),
  exportNumber: yup.string(),
  tags: yup.array().required(),
  importNumber: yup.string(),
  numberOfFiles: yup.number().required(),
  refrenceCircularID: yup.string(),
});

const UPDATE_CIRCULAR_LETTER = gql`
mutation UpdateCircularLetter($id: ID!, $data: updateCircularLetter){
  updateCircularLetter(id: $id, data: $data)
}
`;

const LETTER_QUERY = gql`
query QueryLetters($id: ID!){
  circularLetterDetails(id: $id) {
    circularLetter{
    _id
    title
    number
    importNumber
    exportNumber
    referTo
    from
    date
    subjectedTo
    toCategory
    tags
    files
    }
    filesName
    refrenceId
  }
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

// export const GET_ALL = gql`
// query GetBothLists{
//   categoriesQuery{
//     subjectedTos { 
//       id,
//       name 
//     },
//     toCategories{
//       id,
//       name
//     }
//   }
// }
// `;

function useQueryParam() {
  return new URLSearchParams(useLocation().search);
}
const handleNumber = (numberToProcess: string) => {
  if (numberToProcess) {
    const numberToShow: Array<any> = [];
    const numberParts = numberToProcess.split('/');
    numberParts.forEach((part: string, index: number) => {
      numberToShow.push(
        <Box
          key={index.toString()}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {index !== 0 && <Box>
            /
          </Box>}
          <Box>
            {part}
          </Box>
        </Box>
      );
    });
    return numberToShow.map((number: any) => {
      return number;
    });
  }
}
const EditCircularLetter = (props: any) => {
  const {
    title,
    date,
    number,
    type,
    sender,
    addFileUpload,
    setFileUpload,
    clearFiles,
    uploadFilesStatus,
    toCategory,
    addFile,
    removeFile,
    subjectedTo,
    files,
    exportNumber,
    tags,
    importNumber,
    numberOfFiles,
    refrenceCircularID,
    setAnyThing,
    clearAnyThing,
    setListOfSubjects,
    setListOfCategories,
  } = props;
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [tempTag, setTempTag] = useState('');
  const [open, setOpen] = React.useState(false);
  const [openFileDelete, setOpenFileDelete] = useState(false);
  const [fileToDelete, setFileToDelete] = useState({ name: '', index: 0 });
  const [width, setWidth] = useState(window.innerWidth);
  const [tempDate, setTempDate] = useState(jMoment());
  const [height, setHeight] = useState(window.innerHeight);
  const [disabledButton, setDisabledButton] = useState(true);
  const [deleteFileSuccess, setDeleteFileSuccess] = useState(false);
  const [deleteFileFailure, setDeleteFileFailure] = useState(false);
  const [deleteCircularFailure, setDeleteCircularFailure] = useState(false);
  const [editFileFailure, setEditFileFailure] = useState(false);
  const [lastStepMessage, setLastStepMessage] = useState('');
  const client = useApolloClient();
  let queryParam = useQueryParam();
  if (props.data) {
    var propsData = props.data;
    if (props.data.circularLetterDetails) {
      var filesNameQuery = props.data.circularLetterDetails.filesName;
      var letterData = props.data.circularLetterDetails.circularLetter;
    }
    if (props.data.categoriesQuery) {
      var lists = props.data.categoriesQuery;
    }
  }
  const updateWidthAndHeight = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };
  useEffect(() => {
    if (propsData) {
      if (lists) {
        setListOfCategories(lists.toCategories);
        setListOfSubjects(lists.subjectedTos);
      }
      if (letterData) {
        var momentDate = jMoment(letterData.date, 'jYYYY/jM/jD').format('YYYY/MM/DD');
        setTempDate(jMoment(momentDate));
        setAnyThing({
          theThing: 'date',
          data: letterData.date,
        });
        addFileUpload(filesNameQuery.length);
        setAnyThing({
          theThing: 'numberOfFiles',
          data: filesNameQuery.length,
        });
        filesNameQuery.forEach((fileName: string, index: number) => [
          setFileUpload({
            index,
            status: true,
            link: letterData.files[index],
            name: fileName,
          })
        ]);
        setAnyThing({
          theThing: 'filesName',
          data: filesNameQuery,
        });
        setAnyThing({
          theThing: 'files',
          data: letterData.files,
        });
        setAnyThing({
          theThing: 'sender',
          data: letterData.from,
        });
        if (letterData.importNumber) {
          setAnyThing({
            theThing: 'type',
            data: 'imported',
          });
        } if (letterData.exportNumber) {
          setAnyThing({
            theThing: 'type',
            data: 'exported',
          });
        }
        setAnyThing({
          theThing: 'exportNumber',
          data: letterData.exportNumber,
        });
        setAnyThing({
          theThing: 'importNumber',
          data: letterData.importNumber,
        });
        setAnyThing({
          theThing: 'number',
          data: letterData.number,
        });
        setAnyThing({
          theThing: 'refrenceCircularID',
          data: letterData.referTo,
        });
        setAnyThing({
          theThing: 'subjectedTo',
          data: letterData.subjectedTo,
        });
        setAnyThing({
          theThing: 'tags',
          data: letterData.tags,
        });
        setAnyThing({
          theThing: 'title',
          data: letterData.title,
        });
        setAnyThing({
          theThing: 'toCategory',
          data: letterData.toCategory,
        });
      }
    }
    window.addEventListener("resize", updateWidthAndHeight);
    return () => window.removeEventListener("resize", updateWidthAndHeight);
  }, [setListOfCategories, setListOfSubjects, setAnyThing, letterData, lists, addFileUpload, setFileUpload, propsData, filesNameQuery]);

  if (props.data) {
    if (props.data.error) {
      if (props.data.error.message === 'GraphQL error: Authentication required') {
        return (<Redirect to={{
          pathname: '/login',
        }} />)
      }
    }
  }
  const renderTags = (tags: Array<string>) => {
    return tags.map((tag, index) => {
      return (
        <Tag
          id={index}
          key={index.toString()}
          tag={tag}
          onClick={() => {
            props.removeTag(tag);
          }}
        />
      )
    })
  };
  const openDeleteFileSuccess = () => {
    setDeleteFileSuccess(true);
  };
  const closeDeleteFileSuccess = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setDeleteFileSuccess(false);
  };
  const openDeleteFileFailure = () => {
    setDeleteFileFailure(true);
  };
  const closeDeleteFileFailure = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setDeleteFileFailure(false);
  };
  const openDeleteCircularFailure = () => {
    setDeleteCircularFailure(true);
  };
  const closeDeleteCircularFailure = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setDeleteCircularFailure(false);
  };
  const openEditFileFailure = () => {
    setEditFileFailure(true);
  };
  const closeEditFileFailure = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setEditFileFailure(false);
  };
  function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handleUploadFiles = (no: number, addFile: any) => {
    const upload = [];
    for (let i = 0; i < no; i++) {
      upload.push(
        <Box
          style={{ marginTop: 40 }}
          key={i.toString()}>
          <UploadOneFile
            index={i}
            hasRemove
            removeFromRedux={(name: string) => {
              setAnyThing({
                theThing: 'numberOfFiles',
                data: parseInt(numberOfFiles, 10) - 1,
              });
              props.removeFilesName(name);
              props.removeFileUploadStatus(i);
            }}
            imageStyle={{
              height: 256,
              width: 192,
            }}
            file={uploadFilesStatus[i]}
            onDeleteFile={(name: string) => {
              handleOpenFileToDelete();
              setFileToDelete({
                name,
                index: i
              });
              // setFileUpload({
              //   index: i,
              //   status: false,
              //   link: '',
              // });
            }}
            onCompleted={(data: any) => {
              setFileUpload({
                index: i,
                status: true,
                link: data.uploadFile.filePath,
                name: data.uploadFile.filename,
              });
              props.addFilesName(data.uploadFile.filename);
            }}
          />
        </Box>
      );
    }
    return upload.map((UploadFile) => {
      return UploadFile;
    });
  }

  const errorCheck = (name: string) => {
    let hasError = false;
    props.errors.forEach((errorName: string) => {
      if (name === errorName) {
        hasError = true;
      }
    });
    return hasError;
  }

  const validateDetails = () => {
    schema.validate({
      title,
      date,
      number,
      type,
      sender,
      toCategory,
      subjectedTo,
      exportNumber,
      tags,
      importNumber,
      numberOfFiles,
      refrenceCircularID,
    }, {
      abortEarly: false,
    }).then(() => {
      props.setErrors([]);
      setDisabledButton(false);
    }).catch(e => {
      props.setErrors(e.inner);
      setDisabledButton(true);
    });
  }

  const handleDisabled = () => {
    if (activeStep === 0) {
      if (!(title && date && number && type && sender && toCategory && subjectedTo && tags.length > 0)) {
        return true;
      } return false;
    } if (activeStep === 1) {
      if ((files.length === parseInt(numberOfFiles, 10) && numberOfFiles > 0) || props.filesName.length === parseInt(numberOfFiles, 10) && numberOfFiles > 0) {
        return false;
      } return true;
    }
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleOpenFileToDelete = () => {
    setOpenFileDelete(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseFileToDelete = () => {
    setOpenFileDelete(false);
  };


  if (props.data.loading) {
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
    <Mutation mutation={UPDATE_CIRCULAR_LETTER}
      onCompleted={() => {
        client.resetStore();
        setLastStepMessage('تغییرات با موفقیت اعمال شد');
        props.history.push(`/letter?id=${queryParam.get('id')}`);
      }}
      onError={(error: any) => {
        if (error.message === 'GraphQL error: Number is taken!') {
          setLastStepMessage('این شماره بخشنامه قبلا ثبت شده است');
        } else {
          setLastStepMessage('دوباره تلاش کنید');
          openEditFileFailure();
        }
      }}
    >
      {(updateCircularLetter: any, { loading, error, data }: any) => {
        const disableReturnStep = () => {
          if (loading) {
            return true;
          } return false;
        }
        if (loading) {
          setLastStepMessage('در حال اعمال تغییرات');
        }
        return (<Mutation mutation={DELETE_WHILE_UPDATE}
          onCompleted={() => {
            setAnyThing({
              theThing: 'numberOfFiles',
              data: parseInt(numberOfFiles, 10) - 1,
            });
            openDeleteFileSuccess();
            removeFile(fileToDelete.name);
            props.removeFilesName(fileToDelete.name);
            props.removeFileUploadStatus(fileToDelete.index);
          }}
          onError={() => {
            openDeleteFileFailure();
          }}
        >
          {(deleteFileWhileUpdate: any, { loading, error, data }: any) => {
            return (
              <Mutation mutation={DELETE_CIRCULAR_LETTER}
                onCompleted={() => {
                  props.history.push('/search-letter')
                }}
                onError={() => {
                  openDeleteCircularFailure();
                }}
              >
                {(deleteCircularLetter: any, { data, loading }: any) => {
                  if (loading) {
                    return (
                      <Box style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                      }}>
                        <Backdrop className={classes.backdrop} open>
                          <CircularProgress style={{ height: '8vmax', width: '8vmax' }} />
                        </Backdrop>
                      </Box>
                    );
                  }
                  return (
                    <Mutation mutation={UPLOAD_CIRCULAR_LETTER}>
                      {(circularLetterInit: any, { data, loading }: any) => {
                        return (
                          <Box style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <Stepper
                              disabled={handleDisabled()}
                              returnDisabled={disableReturnStep()}
                              returnHref={`/letter?${queryParam.get('id')}`}
                              customLastStep={lastStepMessage}
                              customLabels={['ویرایش مشخصات بخشنامه', 'ویرایش  فایل‌های بخشنامه', 'کنترل اطلاعات ویرایش شده']}
                              onNext={(e: any) => {
                                if (e === 2) {
                                  updateCircularLetter({
                                    variables: {
                                      id: queryParam.get('id'),
                                      data: {
                                        title,
                                        date,
                                        number,
                                        tags: tags,
                                        files: props.filesName,
                                        from: sender,
                                        toCategory,
                                        subjectedTo,
                                        exportNumber,
                                        importNumber,
                                        referTo: refrenceCircularID,
                                      }
                                    },
                                  });
                                }
                              }}
                              getNextStep={(activeStep: number) => {
                                setActiveStep(activeStep);
                              }}
                              getPreviousStep={(activeStep: number) => {
                                setActiveStep(activeStep);
                              }}
                            >
                              {
                                activeStep === 0 && (
                                  <Box className={classes.fieldTopBox}
                                    style={{
                                      flexDirection: width < RESPONSIVE_WIDTH ? 'column-reverse' : 'row',
                                      justifyContent: width < RESPONSIVE_WIDTH ? 'center' : 'space-between',
                                      alignItems: width < RESPONSIVE_WIDTH ? 'center' : 'flex-start',
                                    }}>
                                    <Snackbar open={deleteCircularFailure} autoHideDuration={10000} onClose={closeDeleteCircularFailure}>
                                      <Alert className={classes.snackStyle} onClose={closeDeleteCircularFailure} severity="error">
                                        <Box className={classes.snackBox}>
                                          حذف بخشنامه با مشکل مواجه شد، لطفا دوباره تلاش کنید
                                      </Box>
                                      </Alert>
                                    </Snackbar>
                                    <Box className={classes.tagsTopBoxField}>
                                      <Button
                                        variant="contained"
                                        href="/editDropDowns"
                                        style={{
                                          paddingRight: 50,
                                          paddingLeft: 50,
                                          fontFamily: 'FontNormal',
                                          marginTop: 25,
                                          marginBottom: 20,
                                          alignSelf: width <= RESPONSIVE_WIDTH ? 'center' : '',
                                        }}
                                      >
                                        مدیریت مقاطع و حوزه‌ها
                                      </Button>
                                      <Button
                                        variant="contained"
                                        onClick={handleOpen}
                                        style={{
                                          paddingRight: 50,
                                          backgroundColor: '#c62828',
                                          color: 'white',
                                          width: 240,
                                          paddingLeft: 50,
                                          fontFamily: 'FontNormal',
                                          // marginTop: 25,
                                          marginBottom: 20,
                                          alignSelf: width <= RESPONSIVE_WIDTH ? 'center' : '',
                                        }}
                                      >
                                        حذف کامل بخشنامه
                                      </Button>
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
                                              آیا از حذف این بخشنامه به طور کامل اطمینان دارید؟
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
                                                  deleteCircularLetter({
                                                    variables: {
                                                      id: props.data.variables.id,
                                                    }
                                                  });
                                                }}
                                                className={classes.modalButtons}
                                                style={{ backgroundColor: 'red', color: 'white' }}>
                                                ادامه
                                        </Button>
                                            </Box>
                                          </Box>
                                        </Fade>
                                      </Modal>
                                      <Box style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        alignSelf: width <= RESPONSIVE_WIDTH ? 'center' : '',
                                      }}>
                                        <Tooltip
                                          arrow
                                          className={classes.tipTool}
                                          leaveDelay={400}
                                          title={
                                            <div className={classes.tipToolText}>
                                              {numberToolTip}
                                            </div>
                                          }
                                        >
                                          <InfoOutlinedIcon />
                                        </Tooltip>
                                        <TextInput
                                          id="number"
                                          error={errorCheck('number')}
                                          value={number}
                                          label="شماره بخشنامه"
                                          onChange={(event: any) => setAnyThing({
                                            theThing: 'number',
                                            data: event.target.value
                                          })}
                                        />
                                      </Box>
                                      <InputLabel className={classes.selectTopInputLabel} id="to">
                                        :کلمات کلیدی
                                      </InputLabel>
                                      <Box className={classes.tagsWithButtonBox}>
                                        <Tooltip
                                          arrow
                                          className={classes.tipTool}
                                          leaveDelay={400}
                                          title={
                                            <div className={classes.tipToolText}>
                                              {toolTipText}
                                            </div>
                                          }
                                        >
                                          <InfoOutlinedIcon />
                                        </Tooltip>
                                        <Button
                                          className={classes.titleDiv}
                                          variant="outlined"
                                          color="primary"
                                          onClick={() => {
                                            if (!!tempTag) {
                                              props.addTag(tempTag);
                                              setTempTag('');
                                            }
                                          }}
                                        >
                                          افزودن
                                        </Button>
                                        <TextInput
                                          id="tags"
                                          style={{ width: 213 }}
                                          label="تگ‌ها"
                                          value={tempTag}
                                          onChange={(event: any) => {
                                            setTempTag(event.target.value);
                                          }}
                                        />
                                      </Box>
                                      <Box className={classes.renderTagsBox}>
                                        {renderTags(tags)}
                                      </Box>
                                    </Box>
                                    <Box className={classes.leftBoxField} style={{ marginLeft: width >= RESPONSIVE_WIDTH ? 80 : 0 }}>
                                      <InputLabel className={classes.selectTopInputLabel} id="type">
                                        :نوع بخشنامه
                                      </InputLabel>
                                      <Select
                                        id="type"
                                        className={classes.leftSelect}
                                        value={type}
                                        variant="outlined"
                                        labelId="label"
                                        onChange={(event: any) => {
                                          setAnyThing({
                                            theThing: 'type',
                                            data: event.target.value,
                                          });
                                          clearAnyThing({
                                            theThing: 'importNumber'
                                          });
                                          clearAnyThing({
                                            theThing: 'exportNumber'
                                          });
                                        }}
                                      >
                                        <MenuItem className={classes.menuItem} value="imported">
                                          وارد شده
                                        </MenuItem>
                                        <MenuItem className={classes.menuItem} value="exported">
                                          صادر شده
                                        </MenuItem>
                                      </Select>
                                      <TextInput
                                        id="registeredNumber"
                                        label={type === 'imported' ? 'شماره ثبت وارده' : 'شماره ثبت صادره'}
                                        value={type === 'imported' ? importNumber : exportNumber}
                                        onChange={(event: any) => {
                                          type === 'imported' ?
                                            setAnyThing({
                                              theThing: 'importNumber',
                                              data: event.target.value
                                            }) : setAnyThing({
                                              theThing: 'exportNumber',
                                              data: event.target.value
                                            })
                                        }}
                                      />
                                      <Box className={classes.inpuLabelBox}>
                                        <InputLabel className={classes.selectTopInputLabel} id="type">
                                          :حوزه مربوطه
                                        </InputLabel>
                                      </Box>
                                      <Box className={classes.selectBox}>
                                        <Select
                                          id="subjectedTo"
                                          className={classes.leftSelect}
                                          value={subjectedTo}
                                          variant="outlined"
                                          labelId="label"
                                          onChange={(event: any) => {
                                            setAnyThing({
                                              theThing: 'subjectedTo',
                                              data: event.target.value,
                                            });
                                          }}
                                        >
                                          {props.listOfSubjects.map((subject: { name: string, id: string }, index: number) => {
                                            return (
                                              <MenuItem
                                                key={index.toString()}
                                                className={classes.menuItem}
                                                style={{
                                                  paddingRight: 20,
                                                }}
                                                value={subject.name}>
                                                {subject.name}
                                              </MenuItem>
                                            );
                                          })}
                                        </Select>
                                      </Box>
                                    </Box>
                                    <Box className={classes.rightBoxField} style={{ marginLeft: width >= RESPONSIVE_WIDTH ? 80 : 0 }}>
                                      <InputLabel className={classes.selectTopInputLabel} id="title">
                                        :مشخصات
                                      </InputLabel>
                                      <TextInput
                                        id="title"
                                        error={errorCheck('title')}
                                        label="عنوان"
                                        value={title}
                                        onChange={(event: any) => setAnyThing({
                                          theThing: 'title',
                                          data: event.target.value
                                        })}
                                      />
                                      <InputLabel className={classes.selectTopInputLabel} id="to">
                                        :تاریخ
                                      </InputLabel>
                                      <DatePicker2
                                        value={tempDate}
                                        getSelectedDate={(date: string) => {
                                          var momentDate = jMoment(date, 'jYYYY/jM/jD').format('YYYY/MM/DD');
                                          setTempDate(jMoment(momentDate));
                                          setAnyThing({
                                            theThing: 'date',
                                            data: date,
                                          });
                                        }}
                                      />
                                      <TextInput
                                        id="from"
                                        error={errorCheck('sender')}
                                        label="صادر کننده"
                                        value={sender}
                                        onChange={(event: any) => setAnyThing({
                                          theThing: 'sender',
                                          data: event.target.value
                                        })}
                                      />
                                      <InputLabel className={classes.selectTopInputLabel} id="to">
                                        :مرتبط به مقطع
                                      </InputLabel>
                                      <Box className={classes.selectBox}>
                                        <Select
                                          id="to"
                                          error={errorCheck('to')}
                                          className={classes.select}
                                          value={toCategory}
                                          variant="outlined"
                                          labelId="label"
                                          onChange={(event: any) => setAnyThing({
                                            theThing: 'toCategory',
                                            data: event.target.value
                                          })}
                                        >
                                          {props.listOfCategories.map((category: { name: string, id: string }, index: number) => (
                                            <MenuItem
                                              key={index.toString()}
                                              className={classes.menuItem}
                                              style={{
                                                paddingRight: 20,
                                              }}
                                              value={category.name}
                                            >
                                              {category.name}
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      </Box>
                                      <TextInput
                                        id="refer to"
                                        label="ارجاع به شماره"
                                        value={refrenceCircularID}
                                        onChange={(event: any) => setAnyThing({
                                          theThing: 'refrenceCircularID',
                                          data: event.target.value
                                        })}
                                      />
                                    </Box>
                                  </Box>
                                )
                              }
                              {
                                activeStep === 1 && (
                                  <Box style={{
                                    marginBottom: 20,
                                  }}>
                                    <Snackbar open={deleteFileSuccess} autoHideDuration={6000} onClose={closeDeleteFileSuccess}>
                                      <Alert className={classes.snackStyle} onClose={closeDeleteFileSuccess} severity="success">
                                        <Box className={classes.snackBox}>
                                          فایل با موفقیت حذف شد
                                      </Box>
                                      </Alert>
                                    </Snackbar>
                                    <Snackbar open={deleteFileFailure} autoHideDuration={6000} onClose={closeDeleteFileFailure}>
                                      <Alert className={classes.snackStyle} onClose={closeDeleteFileFailure} severity="error">
                                        <Box className={classes.snackBox}>
                                          حذف فایل با مشکل مواجه شد، لطفا دوباره تلاش کنید
                                      </Box>
                                      </Alert>
                                    </Snackbar>
                                    <Modal
                                      aria-labelledby="modal-title"
                                      aria-describedby="delete-modal-description"
                                      className={classes.modal}
                                      open={openFileDelete}
                                      onClose={handleCloseFileToDelete}
                                      closeAfterTransition
                                      BackdropComponent={Backdrop}
                                      BackdropProps={{
                                        timeout: 500,
                                      }}
                                    >
                                      <Fade in={openFileDelete}>
                                        <Box className={classes.paper}>
                                          <Box className={classes.modalTitle}>
                                            هشدار
                                            </Box>
                                          <Box className={classes.modalDescription}>
                                            آیا از حذف این فایل اطمینان دارید (برگشتی وجود ندارد) ؟
                                            </Box>
                                          <Box style={{
                                            alignSelf: 'center',
                                            marginTop: 10,
                                          }}>
                                            <Button className={classes.modalButtons} onClick={handleCloseFileToDelete}>
                                              بازگشت
                                              </Button>
                                            <Button
                                              onClick={() => {
                                                deleteFileWhileUpdate({
                                                  variables: {
                                                    id: queryParam.get('id'),
                                                    filename: fileToDelete.name,
                                                  }
                                                });
                                                handleCloseFileToDelete();
                                              }}
                                              className={classes.modalButtons}
                                              style={{ backgroundColor: 'red', color: 'white' }}>
                                              ادامه
                                              </Button>
                                          </Box>
                                        </Box>
                                      </Fade>
                                    </Modal>
                                    <Box
                                      style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontFamily: 'FontNormal',
                                        fontSize: 15,
                                      }}
                                    >
                                      افزودن فایل جدید
                                    <Fab
                                        style={{ marginLeft: 20 }}
                                        onClick={() => {
                                          props.increamentFileUpload();
                                          setAnyThing({
                                            theThing: 'numberOfFiles',
                                            data: parseInt(numberOfFiles, 10) + 1
                                          });
                                        }}
                                        color="primary"
                                        aria-label="add"
                                      >
                                        <AddIcon />
                                      </Fab>
                                    </Box>
                                    <Box style={{
                                      display: 'flex',
                                      flexDirection: 'row',
                                      flexWrap: 'wrap',
                                      paddingLeft: 40,
                                      paddingRight: 40,
                                      alignItems: 'center',
                                      justifyContent: 'flex-start',
                                    }}>
                                      {handleUploadFiles(numberOfFiles, addFile)}
                                    </Box>
                                  </Box>
                                )
                              }
                              {
                                activeStep === 2 && (
                                  <Box style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                  }}>
                                    <Snackbar open={editFileFailure} autoHideDuration={6000} onClose={closeEditFileFailure}>
                                      <Alert className={classes.snackStyle} onClose={closeEditFileFailure} severity="error">
                                        <Box className={classes.snackBox}>
                                          مشکلی در اعمال تغییرات پیش آمد، لطفا دوباره تلاش کنید
                                      </Box>
                                      </Alert>
                                    </Snackbar>
                                    <Box
                                      border={1}
                                      borderRadius={7}
                                      borderColor="#00bcd4"
                                      style={{
                                        display: 'flex',
                                        minWidth: 500,
                                        flexDirection: 'column',
                                        alignItems: 'flex-end',
                                        justifyContent: 'center',
                                        padding: 30,
                                        marginBottom: 10,
                                      }}>
                                      <Box className={classes.checkInfoBox}>
                                        <Box style={{
                                          display: 'flex',
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                        }}>
                                          {title}
                                          <Box style={{
                                            marginLeft: 5
                                          }}>
                                            :
                                          </Box>
                                          <Box>
                                            عنوان
                                          </Box>
                                        </Box>
                                      </Box>
                                      <Box className={classes.checkInfoBox}>
                                        <Box style={{
                                          display: 'flex',
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                        }}>
                                          {handleNumber(number)}
                                          <Box style={{ marginLeft: 5, }}>
                                            :
                                          </Box>
                                          <Box>
                                            شماره
                                          </Box>
                                        </Box>
                                      </Box>
                                      <Box className={classes.checkInfoBox}>
                                        تاریخ: {date}
                                      </Box>
                                      <Box className={classes.checkInfoBox}>
                                        <Box style={{
                                          display: 'flex',
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                        }}>
                                          {sender}
                                          <Box style={{
                                            marginLeft: 5
                                          }}>
                                            :
                                          </Box>
                                          <Box>
                                            صادرکننده
                                          </Box>
                                        </Box>
                                      </Box>
                                      <Box className={classes.checkInfoBox}>
                                        مرتبط با مقطع: {toCategory}
                                      </Box>
                                      <Box className={classes.checkInfoBox}>
                                        <Box style={{
                                          display: 'flex',
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                        }}>
                                          {type === 'imported' ? importNumber : exportNumber}
                                          {(!importNumber && !exportNumber) && 'ندارد'}
                                          <Box style={{
                                            marginLeft: 5
                                          }}>
                                            :
                                          </Box>
                                          <Box>
                                            {type === 'imported' ? "شماره ثبت وارده" : "شماره ثبت صادره"}
                                          </Box>
                                        </Box>
                                      </Box>
                                      <Box className={classes.checkInfoBox}>
                                        حوزه مربوطه: {subjectedTo}
                                      </Box>
                                      {refrenceCircularID && <Box className={classes.checkInfoBox}>
                                        <Box style={{
                                          display: 'flex',
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                        }}>
                                          {handleNumber(refrenceCircularID)}
                                          <Box style={{ marginLeft: 5, }}>
                                            :
                                          </Box>
                                          <Box>
                                            ارجاع به شماره
                                          </Box>
                                        </Box>
                                      </Box>}
                                      <Box className={classes.checkInfoBox}>
                                        {!refrenceCircularID && ".ارجاعی به بخشنامه دیگری ندارد"}
                                      </Box>
                                      <Box className={classes.checkInfoBox}
                                        style={{
                                          display: 'flex',
                                          flexDirection: 'row',
                                        }}
                                      >
                                        <Box
                                          style={{
                                            marginRight: 5,
                                          }}
                                        >
                                          {handleTags(tags)}
                                        </Box>
                                          :تگ‌ها
                                        </Box>
                                    </Box>
                                  </Box>
                                )
                              }
                            </Stepper>
                          </Box>
                        )
                      }
                      }
                    </Mutation>
                  );
                }}
              </Mutation>
            );
          }}
        </Mutation>);
      }}

    </Mutation>
  );
}

const mapStateToProps = (state: any) => {
  const {
    title,
    date,
    details,
    type,
    files,
    number,
    sender,
    numberOfFiles,
    filesName,
    tags,
    subjectedTo,
    toCategory,
    uploadFilesStatus,
    innerWidth,
    exportNumber,
    errors,
    importNumber,
    refrenceCircularID,
    listOfSubjects,
    listOfCategories,
  } = state.mainData;
  return {
    title,
    date,
    errors,
    details,
    filesName,
    type,
    listOfCategories,
    listOfSubjects,
    files,
    numberOfFiles,
    innerWidth,
    uploadFilesStatus,
    number,
    sender,
    tags,
    subjectedTo,
    toCategory,
    exportNumber,
    importNumber,
    refrenceCircularID,
  };
}

export default compose(
  withApollo,
  graphql(LETTER_QUERY, {
    options: () => {
      return {
        variables: {
          id: window.location.search.split('=')[1]
        }
      }
    }
  }),
  connect(mapStateToProps, {
    setAnyThing,
    clearAnyThing,
    addFileUpload,
    setFileUpload,
    removeFileUploadStatus,
    removeFile,
    setListOfCategories,
    setListOfSubjects,
    clearFiles,
    addFilesName,
    removeFilesName,
    setWidth,
    increamentFileUpload,
    addFile,
    addTag,
    removeTag,
    clearGraphqlError,
    setErrors,
  }))(EditCircularLetter);