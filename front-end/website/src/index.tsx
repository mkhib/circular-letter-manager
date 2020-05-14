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
import { InMemoryCache } from 'apollo-cache-inmemory';
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
  uri: "https://bdbb8436.ngrok.io/graphql",
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
      <ThemeProvider theme={theme}>
        <StylesProvider jss={jss}>
          <div>
            <App />
          </div>
        </StylesProvider>
      </ThemeProvider>
    </ApolloProvider>
  </Provider>
  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
