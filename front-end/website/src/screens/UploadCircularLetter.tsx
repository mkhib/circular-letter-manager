import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { connect } from 'react-redux';
import {
  setAnyThing,
  clearAnyThing,
  setWidth,
  addTag,
  removeTag,
  addFile,
  clearGraphqlError,
  clearFiles,
  removeFile,
  addFileUpload,
  setFileUpload,
  setErrors,
  setListOfCategories,
  setListOfSubjects,
} from '../redux/slices/data';
import * as yup from 'yup';
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
import DatePickerFarsi from '../components/DatePickerFarsi';
import Backdrop from '@material-ui/core/Backdrop';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import { GET_ALL } from './EditSubjectsAndCategories';
import { useQuery } from '@apollo/react-hooks';
import CircularProgress from '@material-ui/core/CircularProgress';
import circularBack from '../assets/images/circularBack.jpg';
import {
  Redirect,
} from 'react-router-dom';

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
}));

interface tagProps {
  id: number,
  key: string,
  tag: string,
  onClick: any
}

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
اگر شماره بخشنامه شامل حروف فارسی همراه با ممیز است، شماره به صورت عکس مشاهده می‌شود، اما در ثبت شماره به صورت صحیح خللی وارد نمی‌کند
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

const UploadCircularLetter = (props: any) => {
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
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [disabledButton, setDisabledButton] = useState(true);
  const { loading, error, data } = useQuery(GET_ALL);
  useEffect(() => {
    if (data) {
      setListOfCategories(data.categoriesQuery.toCategories);
      setListOfSubjects(data.categoriesQuery.subjectedTos);
      if (data.categoriesQuery.subjectedTos.length > 0) {
        setAnyThing({
          theThing: 'subjectedTo',
          data: data.categoriesQuery.subjectedTos[0].name,
        });
      }
      if (data.categoriesQuery.toCategories.length > 0) {
        setAnyThing({
          theThing: 'toCategory',
          data: data.categoriesQuery.toCategories[0].name,
        });
      }
    }
    window.addEventListener("resize", updateWidthAndHeight);
    return () => window.removeEventListener("resize", updateWidthAndHeight);
  }, [data, setListOfCategories, setListOfSubjects, setAnyThing]);

  if (error) {
    if (error.message === 'GraphQL error: Authentication required') {
      return (<Redirect to={{
        pathname: '/login',
      }} />)
    }
    return `Error! ${error}`;
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

  const handleUploadFiles = (no: number, addFile: any) => {
    const upload = [];
    for (let i = 0; i < no; i++) {
      upload.push(
        <Box
          style={{ marginTop: 40 }}
          key={i.toString()}>
          <UploadOneFile
            file={uploadFilesStatus[i]}
            imageStyle={{
              height: 256,
              width: 192,
            }}
            onDeleteFile={(name: string) => {
              removeFile(name);
              setFileUpload({
                index: i,
                status: false,
                link: '',
              });
            }}
            onCompleted={(data: any) => {
              setFileUpload({
                index: i,
                status: true,
                link: data.uploadFile.filePath,
                name: data.uploadFile.filename,
              });
              addFile(data.uploadFile.filename);
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
      if (files.length === parseInt(numberOfFiles, 10)) {
        return false;
      } return true;
    }
  }

  const handleOpen = () => {
    setOpen(true);
  };
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
  const handleClose = () => {
    setOpen(false);
  };

  const updateWidthAndHeight = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

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
    <Mutation mutation={DELETE_MULTI_FILES}>
      {(deleteMultiFiles: any, { data, loading }: any) => {
        let deleteData = data;
        return (
          <Mutation mutation={UPLOAD_CIRCULAR_LETTER}>
            {(circularLetterInit: any, { data, loading }: any) => {
              return (
                <Box style={{
                  display: 'flex',
                  // minHeight: height,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundImage: `url(${circularBack})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '100vmax',
                }}>
                  <Stepper
                    disabled={handleDisabled()}
                    onNext={(e: any) => {
                      if (e === 2) {
                        circularLetterInit({
                          variables: {
                            title,
                            date,
                            number,
                            tags: tags,
                            files: files,
                            from: sender,
                            toCategory,
                            subjectedTo,
                            exportNumber,
                            importNumber,
                            referTo: refrenceCircularID,
                          },
                        });
                      }
                    }}
                    getNextStep={(activeStep: number) => {
                      // if (activeStep - 1 === 0) {
                      //   // validateDetails();
                      // } else {
                      setActiveStep(activeStep);
                      // }
                    }}
                    getPreviousStep={(activeStep: number) => {
                      setActiveStep(activeStep);
                    }}
                  >
                    {/* <div className={classes.titleDiv}>
          .مشخصات بخشنامه را وارد نمایید
          </div> */}
                    {
                      activeStep === 0 && (
                        <Box className={classes.fieldTopBox}
                          style={{
                            flexDirection: width < RESPONSIVE_WIDTH ? 'column-reverse' : 'row',
                            justifyContent: width < RESPONSIVE_WIDTH ? 'center' : 'space-between',
                            alignItems: width < RESPONSIVE_WIDTH ? 'center' : 'flex-start',
                          }}>
                          <Box className={classes.tagsTopBoxField}>
                            <Button
                              variant="contained"
                              // onClick={handleOpen}
                              href="/editDropDowns"
                              style={{
                                paddingRight: 50,
                                paddingLeft: 50,
                                fontFamily: 'FontNormal',
                                marginTop: 25,
                                marginBottom: 20,
                                // alignSelf: 'center',
                              }}
                            >
                              مدیریت مقاطع و حوزه‌ها
                            </Button>
                            <Box style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
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
                                lang={'fa'}
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
                                id="type"
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
                            <TextInput
                              id="refer to"
                              label="ارجاع به شماره"
                              value={refrenceCircularID}
                              onChange={(event: any) => setAnyThing({
                                theThing: 'refrenceCircularID',
                                data: event.target.value
                              })}
                            />
                            <InputLabel className={classes.selectTopInputLabel} id="numberOfFiles">
                              :تعداد فایل مورد نیاز برای بارگذاری
                            </InputLabel>
                            <TextInput
                              id="numberOfFiles"
                              label=""
                              value={numberOfFiles}
                              type="number"
                              InputLabelProps={{
                                shrink: true,
                              }}
                              onChange={(event: { target: HTMLInputElement }) => {
                                const value = parseInt(event.target.value);
                                if (files.length > 0) {
                                  deleteMultiFiles({
                                    variables: {
                                      filenames: files
                                    }
                                  })
                                }
                                if (value < 1) {
                                  setAnyThing({
                                    theThing: 'numberOfFiles',
                                    data: 1,
                                  });
                                }
                                else if (value > 100) {
                                  setAnyThing({
                                    theThing: 'numberOfFiles',
                                    data: 100,
                                  });
                                }
                                else {
                                  addFileUpload(value);
                                  clearFiles();
                                  setAnyThing({
                                    theThing: 'numberOfFiles',
                                    data: event.target.value,
                                  });
                                }
                              }}
                            />
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
                            <DatePickerFarsi
                              getSelectedDate={(date: string) => {
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
                          </Box>
                        </Box>
                      )
                    }
                    {
                      activeStep === 1 && (
                        <Box style={{
                          display: 'flex',
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          marginBottom: 150,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          {handleUploadFiles(numberOfFiles, addFile)}
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

export default connect(mapStateToProps, {
  setAnyThing,
  clearAnyThing,
  addFileUpload,
  setFileUpload,
  removeFile,
  setListOfCategories,
  setListOfSubjects,
  clearFiles,
  setWidth,
  addFile,
  addTag,
  removeTag,
  clearGraphqlError,
  setErrors,
})(UploadCircularLetter as any);