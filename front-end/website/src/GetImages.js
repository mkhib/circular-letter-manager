import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

export const GET_FILE = gql`
  {
    files{
      filename
      mimetype
      encoding
    }
  }
`;

const GetImages = () => {
  const { loading, error, data } = useQuery(GET_FILE);
  console.log(data);
  return (
    <div>
    </div>
  );
};

export default GetImages;