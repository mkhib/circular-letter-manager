import React, { useState } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import Button from '@material-ui/core/Button';
import { useQuery } from "@apollo/react-hooks";
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import DoneRounded from '@material-ui/icons/DoneRounded';
import DeleteForeverRounded from '@material-ui/icons/DeleteForeverRounded';

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
  // const { data, loading } = useQuery(QUERY_IMAGE);
  // console.log('data', data);
  // if (loading) {
  //   return <div>loading...</div>;
  // }
  const [error, setError] = useState(null);
  return (
    <Mutation mutation={UPLOAD_FILE} onError={(e) => {
      console.log('uploadError', e);
    }} onCompleted={(data) => {
      props.onCompleted(data);
    }}>
      {(uploadFile, { data, loading }) => {
        let loading1 = loading;
        console.log('okkkk', data, loading);
        return (
          <Mutation mutation={DELETE_FILE}>
            {(deleteFile, { data, loading }) => {
              console.log('newLoad', loading, data);
              return (
                <React.Fragment>
                  {props.file.status && (
                    <Box>
                      <Button onClick={() => {
                        props.onDeleteFile(props.file.name);
                        deleteFile({
                          variables: {
                            filename: props.file.name,
                          },
                        })
                      }}>
                        <DeleteForeverRounded />
                      </Button>
                      <img src={props.file.link}
                        style={{
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
                    {(!loading1 && !props.file.status) && <input
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
                        if (file) {
                          console.log('inner', file.name);
                          props.getFileName(file.name);
                        }
                        validity.valid && uploadFile({ variables: { file } })
                      }
                      }
                    />}
                    {loading1 && (<Box style={{
                      marginTop: 10
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