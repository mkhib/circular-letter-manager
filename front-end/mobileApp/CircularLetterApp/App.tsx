import 'react-native-gesture-handler';
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
} from 'react-native';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { Router, Scene, Stack } from 'react-native-router-flux';
import Login from './src/screens/Login';

const client = new ApolloClient({
  uri: 'https://48p1r2roz4.sse.codesandbox.io',
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Stack key="root">
          <Scene key="login" component={Login} title="ورود" />
          {/* <Scene key="register" component={Register} title="Register" />
        <Scene key="home" component={Home} /> */}
        </Stack>
      </Router>
    </ApolloProvider>
  );
};

export default App;
