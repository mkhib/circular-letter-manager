import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const CREATE_USER = gql`
mutation CreateUser($name: String!, $email:String!, $password:String!){
  createUser(name: $name, email: $email, password: $password){
  user{
    id
    name
    password
  },
  token
  }
}
`;

const UploadOneFile = () => {
  return (
    <Mutation mutation={CREATE_USER}>
      {createUser => (
        <>
          <input
            id="username"
            type="text"
            required
          />
          <input
            id="email"
            type="text"
            required
          />
          <input
            id="password"
            type="text"
            required
          />
          <button onClick={() =>
            createUser({
              variables: {
                name: document.getElementById('username').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
              }
            })
          } >
            Create User
        </button>
        </>
      )}
    </Mutation>
  );
};

export default UploadOneFile;