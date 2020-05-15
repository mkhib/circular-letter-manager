import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import gql from 'graphql-tag';
import {
  Redirect,
  useLocation,
} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Pagination from '@material-ui/lab/Pagination';
import DeleteForeverOutlined from '@material-ui/icons/DeleteForeverOutlined';
import { makeStyles, withStyles, Theme } from '@material-ui/core/styles';
import { useQuery } from '@apollo/react-hooks';
import { Mutation } from '@apollo/react-components';
import Backdrop from '@material-ui/core/Backdrop';
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Link from '@material-ui/core/Link';
import Fade from '@material-ui/core/Fade';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    padding: 40,
    paddingRight: '10vmax',
    paddingLeft: '10vmax'
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
  detailWholeBox: {
    display: 'flex',
    borderWidth: 1,
    borderRadius: 7,
    borderColor: 'black',
    flexDirection: 'column',
    fontFamily: 'FontNormalFD',
    fontSize: 17,
    // width: '50vmax',
    alignItems: 'flex-end',
  },
  detailBox: {
    marginBottom: 20,
  },
  letterSize: {
    height: 512,
    width: 384
  },
  line: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
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
  root: {
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));

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
    refrenceId
  }
}
`;

const DELETE_CIRCULAR_LETTER = gql`
mutation DeleteCirculatLetter($id: ID!){
  deleteCircularLetter(id: $id)
}
`;

const MyPaginator = withStyles((theme: Theme) => ({
  root: {
    fontFamily: 'FontNormalFD',
  },
}))(Pagination);

function useQueryParam() {
  return new URLSearchParams(useLocation().search);
}

const Letter = (props: any) => {
  const classes = useStyles();
  const [numberOfFiles, setNumberOfFiles] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [fileToShow, setFileToShow] = useState(0);
  let queryParam = useQueryParam();
  const handleID = () => {
    const id = queryParam.get('id');
    if (id !== null) {
      return id;
    } return '';
  }
  const { loading, error, data } = useQuery(LETTER_QUERY, { variables: { id: handleID() }, });
  if (data) {
    console.log('sadad', data);
    var queryData = data.circularLetterDetails.circularLetter;
    if (data.circularLetterDetails.refrenceId) {
      var refrence = data.circularLetterDetails.refrenceId;
    }
  }
  React.useEffect(() => {
    if (data) {
      setNumberOfFiles(queryData.files.length);
    }
  }, [data, setNumberOfFiles, queryData]);
  if (error) {
    return (
      <Redirect to="/search-letter" />
    );
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
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
  if (loading) return null;
  if (error) return `Error! ${error}`;
  return (
    <Mutation mutation={DELETE_CIRCULAR_LETTER}>
      {(deleteCircularLetter: any, { data, loading }: any) => {
        const deleteFunction = () => {
          console.log('id', queryData._id);
          deleteCircularLetter({ variables: { id: queryData._id } });
        }
        if (data) {
          handleClose();
          window.location.pathname = "/search-letter";
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
        const handleReferTo = () => {
          if (queryData) {
            if (refrence) {
              return (
                <Box className={classes.line}>
                  <Link
                    href={`${window.location.pathname}?id=${refrence}`}
                    target="_blank"
                  >
                    <Box style={{ display: 'flex', flexDirection: 'row' }}>
                      {handleNumber(queryData.referTo)}
                    </Box>
                  </Link>
                  <Box style={{
                    marginLeft: 5,
                  }}>
                    :ارجاع به شماره
                  </Box>
                </Box>
              )
            } if (queryData.referTo) {
              return (
                <Box className={classes.line}>
                  <Box style={{ marginRight: 5, display: 'flex', flexDirection: 'row' }}>
                    {handleNumber(queryData.referTo)}
                  </Box>
                  :ارجاع به شماره
                </Box>
              )
            } else {
              return (
                <Box className={classes.line}>
                  .ارجاعی به بخشنامه دیگری ندارد
                </Box>
              )
            }
          }
        }
        return (
          <Box className={classes.container}>
            <Box className={classes.detailWholeBox}>
              <Box className={classes.detailBox}>
                عنوان: {queryData.title}
              </Box>
              <Box className={classes.line}>
                <Box style={{ marginRight: 5, display: 'flex', flexDirection: 'row' }}>
                  {handleNumber(queryData.number)}
                </Box>
                  :شماره
                </Box>
              <Box className={classes.detailBox}>
                {queryData.date} :تاریخ
                </Box>
              <Box className={classes.detailBox}>
                صادرکننده: {queryData.from}
              </Box>
              <Box className={classes.detailBox}>
                مرتبط با مقطع: {queryData.toCategory}
              </Box>
              <Box className={classes.line}>
                <Box style={{ marginRight: 5 }}>
                  {queryData.importNumber || queryData.exportNumber}
                </Box>
                {queryData.importNumber ? ':شماره ثبت وارده' : ':شماره ثبت صادره'}
              </Box>
              <Box className={classes.detailBox}>
                حوزه مربوطه: {queryData.subjectedTo}
              </Box>
              {handleReferTo()}
              <Box className={classes.detailBox}>
                {queryData.files.length} :تعداد فایل‌ها
              </Box>
              <Box className={classes.detailBox}>
                کلمات کلیدی:{' '}{handleTags(queryData.tags)}
              </Box>
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
                        onClick={deleteFunction}
                        className={classes.modalButtons}
                        style={{ backgroundColor: 'red', color: 'white' }}>
                        ادامه
                      </Button>
                    </Box>
                  </Box>
                </Fade>
              </Modal>
            </Box>
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start'
              }}>
              <Box style={{
                fontFamily: 'FontNormal',
                fontSize: 14,
              }}>
                <Button
                  onClick={() => {
                    props.history.push({
                      pathname: `/edit-circular-letter?id=${queryData._id}`,
                      state: {
                        queryData
                      }
                    })
                  }}
                  href={`/edit-circular-letter?id=${queryData._id}`}
                  style={{ marginRight: 10 }}
                >
                  <EditIcon style={{ height: 30, width: 30 }} />
                </Button>
                 ویرایش مشخصات بخشنامه
              </Box>
              <Box style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
                <Button
                  target="_blank" rel="noopener noreferrer"
                  href={queryData.files[fileToShow]}
                >
                  <img
                    className={classes.letterSize}
                    src={queryData.files[fileToShow]}
                    alt='letterImage'
                  />
                </Button>
                <MyPaginator
                  count={numberOfFiles}
                  style={{ direction: 'rtl', marginTop: 20 }}
                  color="primary"
                  onChange={(_a, b) => {
                    setFileToShow(b - 1);
                  }}
                />
              </Box>
            </Box>
          </Box>
        );
      }}
    </Mutation>
  );
}

export default withRouter(Letter as any);
