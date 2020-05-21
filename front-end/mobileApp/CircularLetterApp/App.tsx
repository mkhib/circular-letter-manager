import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import SplashScreen from 'react-native-splash-screen';
import { Router, Scene, Stack, Tabs } from 'react-native-router-flux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import Login from './src/screens/Login';
import FloatLogin from './src/screens/FloatLogin';
import FloatSignup from './src/screens/FloatSignup';
import Search from './src/screens/Search';
import ForgotPassword from './src/screens/ForgotPassword';
import ChangePasswordLock from './src/screens/ChangePasswordLock';
import { colors, gStyles, shape } from './src/assets/styles/Styles';

const client = new ApolloClient({
  uri: 'https://1254b2d5.ngrok.io/graphql',
});

const SearchIcon = () => {
  return (
    <View>
      <MaterialIcons name="search" size={shape.iconSize - shape.spacing()} />
    </View>
  );
};

const ProfileIcon = () => {
  return (
    <View>
      <FontAwesome name="user-circle" size={shape.iconSize - shape.spacing(1.5)} />
    </View>
  );
};

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  });
  return (
    <ApolloProvider client={client}>
      <Router>
        <Stack key="root">
          <Scene key="auth" hideNavBar>
            <Scene
              key="login"
              component={Login}
              title="ورود"
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
              key="floatLogin"
              // initial
              component={FloatLogin}
              title="ورود"
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
                component={Search}
                title="پروفایل"
                hideNavBar
              />
            </Tabs>
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
