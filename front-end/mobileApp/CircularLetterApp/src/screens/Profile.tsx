import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, StyleProp, ViewStyle } from 'react-native';
import { Actions } from 'react-native-router-flux';
import gql from 'graphql-tag';
import { shape, gStyles, colors } from '../assets/styles/Styles';
import { useQuery } from '@apollo/react-hooks';
import { useMutation } from '@apollo/react-hooks';
import profileBack from '../assets/images/profile.jpg';
import Loading from '../components/Loading';
import TextAlert from '../components/TextAlert';

const GET_PROFILE = gql`
query user{
  user{
  firstName
  lastName
  personelNumber
  phoneNumber
  }
}
`;

const LOGOUT = gql`
mutation Logout{
  logout
}
`;

interface IUser {
  user: {
    firstName: string;
    lastName: string;
    personelNumber: string;
    phoneNumber: string;
  }
}

interface LineProps {
  title: string;
  value: string | undefined;
  style?: StyleProp<ViewStyle>;
}

const Line: React.FC<LineProps> = ({ style, title, value }) => (
  <View style={styles.lineContainer}>
    <View>
      <Text style={styles.lineTitle}>
        {title}
      </Text>
    </View>
    <View style={style}>
      <Text style={styles.lineValue}>
        {value}
      </Text>
    </View>
  </View>
);

const Profile = () => {
  const { loading, error, data, refetch } = useQuery<IUser>(GET_PROFILE, {
    notifyOnNetworkStatusChange: true,
  });
  const [logout, { data: _logoutData }] = useMutation(LOGOUT, {
    onCompleted: () => {
      setTimeout(() => {
        Actions.auth();
      }, 0);
    },
  });
  useEffect(() => {
    if (error) {
      if (error.message === 'GraphQL error: Authentication required') {
        Actions.auth();
      }
    }
  }, [error]);
  if (error) {
    console.log('daraim', error);
    if (error.message === 'Network error: Unexpected token T in JSON at position 0' || error.message === 'Network error: Network request failed' || error.message === 'Network error: Timeout exceeded') {
      return (<View
        style={styles.alertView}
      >
        <TextAlert text="اتصال خود را به اینترنت بررسی کنید." state={true} />
        <TouchableOpacity
          style={gStyles.button}
          onPress={() => {
            refetch();
          }}
        >
          <Text style={styles.tryAgainText}>
            تلاش مجدد
          </Text>
        </TouchableOpacity>
      </View>);
    }
  }
  if (data) {
    console.log('fatrt', data);
  }
  if (loading) {
    return (
      <Loading />
    );
  }
  return (
    <ImageBackground
      source={profileBack}
      style={styles.imageBackground}
    >
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          <Line title="نام: " style={styles.lineFlex} value={data?.user.firstName} />
          <Line title="نام‌خانوادگی: " style={styles.lineFlex} value={data?.user.lastName} />
          <Line title="شماره پرسنلی: " value={data?.user.personelNumber} />
          <Line title="شماره تلفن: " value={data?.user.phoneNumber} />
          <TouchableOpacity
            onPress={() => {
              Actions.changePassword();
            }}
            style={styles.buttonStyle}>
            <Text style={styles.textStyle}>تغییر رمزعبور</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => {
              logout();
            }}
          >
            <Text style={styles.textStyle}>خروج از حساب کاربری</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Profile;

const styles = StyleSheet.create({
  lineFlex: {
    flex: 1,
  },
  lineContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.indigo,
    borderRadius: 10,
    justifyContent: 'flex-start',
    alignContent: 'center',
    padding: shape.spacing(),
    marginBottom: shape.spacing(),
    width: 230,
  },
  tryAgainText: {
    ...gStyles.normalText,
    color: 'white',
  },
  alertView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.indigo,
  },
  lineTitle: {
    ...gStyles.normalText,
  },
  lineValue: {
    ...gStyles.normalText,
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: shape.spacing(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    borderWidth: 1,
    width: '100%',
    borderColor: colors.blue,
    paddingVertical: shape.spacing(5),
  },
  textStyle: {
    ...gStyles.normalText,
    color: 'white',
  },
  buttonStyle: {
    ...gStyles.button,
    backgroundColor: colors.blue,
    borderRadius: shape.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: shape.spacing(),
  },
  imageBackground: {
    flex: 1,
  },
});