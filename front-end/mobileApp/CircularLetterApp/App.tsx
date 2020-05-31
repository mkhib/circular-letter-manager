import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  BackHandler,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import ApolloLinkTimeout from 'apollo-link-timeout';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import SplashScreen from 'react-native-splash-screen';
import { Router, Scene, Stack, Tabs } from 'react-native-router-flux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import Login from './src/screens/Login';
import Search from './src/screens/Search';
import ForgotPassword from './src/screens/ForgotPassword';
import ChangePasswordLock from './src/screens/ChangePasswordLock';
import Profile from './src/screens/Profile';
import { colors, shape } from './src/assets/styles/Styles';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import ChangePassword from './src/screens/ChangePassword';
import Letter from './src/screens/Letter';
import Signup from './src/screens/Signup';

const httpLink = createHttpLink({
  uri: 'https://b0da96bb8e0f.ngrok.io/graphql',
});
const timeoutLink = new ApolloLinkTimeout(15000);
const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('tok');
    if (value !== null) {
      return value;
    }
  } catch (e) {
    // error reading value
  }
};

const authLink = setContext(async (_, { headers }) => {
  const token = await getData();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});
const client = new ApolloClient({
  link: authLink.concat(timeoutLink).concat(httpLink),
  cache: new InMemoryCache(),
});
const SearchIcon = ({ focused }: any) => {
  return (
    <View>
      <MaterialIcons
        name="search"
        color={focused ? colors.blue : 'black'}
        size={shape.iconSize - shape.spacing()}
      />
    </View>
  );
};

const ProfileIcon = ({ focused }: any) => {
  return (
    <View>
      <FontAwesome
        name="user-circle"
        color={focused ? colors.blue : 'black'}
        size={shape.iconSize - shape.spacing(1.5)}
      />
    </View>
  );
};

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
    BackHandler.addEventListener('hardwareBackPress', backAction);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  });
  const backAction = () => {
    const scene = Actions.currentScene;
    console.log(scene);
    if (scene === '_search') {
      BackHandler.exitApp();
      return true;
    } else {
      Actions.pop();
    }
    return true;
  };
  return (
    <ApolloProvider client={client}>
      <Router
        backAndroidHandler={() => { return Actions.pop(); }}
      >
        <Stack key="root">
          <Scene key="auth" type="reset" hideNavBar>
            <Scene
              key="login"
              component={Login}
              title="ورود"
              // initial
              hideNavBar
            />
            <Scene
              key="forgotPassword"
              component={ForgotPassword}
              title="فراموشی رمزعبور"
              hideNavBar
            />
            <Scene
              key="changePasswordLock"
              component={ChangePasswordLock}
              title="تغییر اولیه رمز عبور"
              hideNavBar
            />
            <Scene
              key="signup"
              component={Signup}
              title="ثبت‌نام"
              hideNavBar
            />
          </Scene>
          <Scene
            key="main"
            type="reset"
            initial
            hideNavBar
          >
            <Tabs
              hideNavBar
              labelStyle={styles.tabLabel}
            // showLabel={false}
            >
              <Scene
                key="search"
                icon={SearchIcon}
                tabBarLabel={'جست و جو'}
                component={Search}
                title="جست و جو"
                hideNavBar
              />
              <Scene
                key="profile"
                icon={ProfileIcon}
                tabBarLabel={'پروفایل'}
                component={Profile}
                title="پروفایل"
                hideNavBar
              />
            </Tabs>
            <Scene
              key="changePassword"
              component={ChangePassword}
              title="تغییر رمز عبور"
              hideNavBar
            />
            <Scene
              key="letter"
              component={Letter}
              title="بخشنامه"
              hideNavBar
            />
          </Scene>
        </Stack>
      </Router>
    </ApolloProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  tabLabel: {
    fontFamily: 'Vazir-FD',
  },
});
