import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import rtl from 'jss-rtl';
import { create } from 'jss';
import { StylesProvider, jssPreset, ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import * as serviceWorker from './serviceWorker';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { CookiesProvider } from 'react-cookie';
import { InMemoryCache } from 'apollo-cache-inmemory';
import store from './redux/store';
import App from './App';


const uploadLink = createUploadLink({
  uri: "https://bakhshnameyab.ir/graphql",
  credentials: 'include'
});

export const client = new ApolloClient({
  link: ApolloLink.from([uploadLink]),
  cache: new InMemoryCache(),
});

const theme = createMuiTheme({
  direction: 'rtl',
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
