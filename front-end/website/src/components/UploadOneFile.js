import React, { useState } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import DeleteForeverRounded from '@material-ui/icons/DeleteForeverRounded';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
const useStyles = makeStyles(theme => ({
  snackStyle: {
    fontFamily: 'FontNormal',
  },
  snackBox: {
    marginLeft: 20,
    marginRight: 20,
  },
}));
export const UPLOAD_FILE = gql`
  mutation UploadFile($file: Upload!) {
    uploadFile(file: $file){
      filename
      filePath
    }
  }
`;

export const DELETE_FILE = gql`
mutation DeleteFile($filename: String!){
  deleteFile(filename: $filename)
}
`;

export const QUERY_IMAGE = gql`
{
  files
}
`;


const UploadOneFile = (props) => {
  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  const [error, setError] = useState(null);
  const [openError, setOpenError] = useState(false);
  const classes = useStyles();
  const openEditFileFailure = () => {
    setOpenError(true);
  };
  const closeEditFileFailure = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenError(false);
  };
  return (
    <Mutation mutation={UPLOAD_FILE} onError={(e) => {
      openEditFileFailure();
    }} onCompleted={(data) => {
      props.onCompleted(data);
    }}>
      {(uploadFile, { data, loading }) => {
        let loading1 = loading;
        if (props.getLoading) {
          props.getLoading(loading);
        }
        return (
          <Mutation mutation={DELETE_FILE}>
            {(deleteFile, { data, loading }) => {
              return (
                <React.Fragment>
                  <Snackbar open={openError} autoHideDuration={6000} onClose={closeEditFileFailure}>
                    <Alert className={classes.snackStyle} onClose={closeEditFileFailure} severity="error">
                      <Box className={classes.snackBox}>
                        بارگذاری فایل شما با مشکل مواجه شد لطفا دوباره تلاش کنید
                      </Box>
                    </Alert>
                  </Snackbar>
                  {props.file.status && (
                    <Box>
                      <Button onClick={() => {
                        props.onDeleteFile(props.file.name);
                        if (!props.hasRemove) {
                          deleteFile({
                            variables: {
                              filename: props.file.name,
                            },
                          })
                        }
                      }}>
                        <DeleteForeverRounded />
                      </Button>
                      <img src={props.file.link}
                        style={props.imageStyle || {
                          height: 128,
                          width: 96,
                        }} alt='uploadedFile' />
                      {/* <DoneRounded /> */}
                    </Box>
                  )}
                  <Box style={{
                    display: 'flex',
                    flexDirection: 'row',
                    // backgroundColor: 'yellow',
                    // alignSelf: 'center',
                    // width: 200,
                    height: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {(!loading1 && !props.file.status) && (
                      <Box style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                        {(props.hasRemove && !props.file.status) && (
                          <Box>
                            <Button onClick={() => {
                              const filename = props.file.name;
                              props.removeFromRedux(filename);
                            }}>
                              <DeleteForeverRounded />
                            </Button>
                          </Box>
                        )}
                        <input
                          style={{
                            backgroundColor: '#2196f3',
                            padding: 10,
                            marginLeft: 10,
                            marginRight: 10,
                            color: 'white',
                          }}
                          type="file"
                          accept=".jpg,.jpeg,.png,.bmp,.til,.tiff"
                          required
                          onChange={({ target: { validity, files: [file], } }) => {
                            validity.valid && uploadFile({ variables: { file } })
                          }
                          }
                        />
                      </Box>
                    )}
                    {loading1 && (<Box style={{
                      marginTop: 10,
                      marginLeft: 30,
                    }}>
                      <CircularProgress style={{ width: 20, height: 20 }} />
                    </Box>)}
                  </Box>
                </React.Fragment>
              )
            }}

          </Mutation>
        )
      }}
    </Mutation>
  );
};

export default UploadOneFile;