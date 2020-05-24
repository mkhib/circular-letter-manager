import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import rtl from 'jss-rtl';
import { create } from 'jss';
import { StylesProvider, jssPreset, ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import * as serviceWorker from './serviceWorker';
import { ApolloClient, DefaultOptions } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { CookiesProvider } from 'react-cookie';
import { InMemoryCache } from 'apollo-cache-inmemory';
import purple from '@material-ui/core/colors/purple';
import red from '@material-ui/core/colors/red';
import pink from '@material-ui/core/colors/pink';
import green from '@material-ui/core/colors/green';
import deepOrange from '@material-ui/core/colors/deepOrange';
import store from './redux/store';
import App from './App';
// import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
// import { HttpLink } from 'apollo-link-http';

// export const httpLink = new HttpLink({
//   uri: 'https://4ccc63b2.ngrok.io/graphql',
//   credentials: 'include',
// });

// const defaultOptions: DefaultOptions = {
//   watchQuery: {
//     fetchPolicy: 'network-only',
//     errorPolicy: 'ignore',
//   },
//   query: {
//     fetchPolicy: 'network-only',
//     errorPolicy: 'all',
//   },
//   mutate: {
//     fetchPolicy: 'network-only',
//     errorPolicy: 'all',
//   },
// }

const uploadLink = createUploadLink({
  uri: "http://194.5.178.254:3600/graphql",
  credentials: 'include'
});

export const client = new ApolloClient({
  link: ApolloLink.from([uploadLink]),
  cache: new InMemoryCache(),
});

const theme = createMuiTheme({
  direction: 'rtl',
  // transition: ease-in-out, width .35s ease-in-out;
  // transitions:''
});


const jss = create({ plugins: [...jssPreset().plugins, rtl()] });


ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <CookiesProvider>
        <ThemeProvider theme={theme}>
          <StylesProvider jss={jss}>
            <div>
              <App />
            </div>
          </StylesProvider>
        </ThemeProvider>
      </CookiesProvider>
    </ApolloProvider>
  </Provider>
  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
