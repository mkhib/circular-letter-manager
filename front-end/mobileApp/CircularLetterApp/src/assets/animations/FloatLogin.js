import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FloatingTitleTextInputField } from './floating_title_text_input_field';

export default class Login extends React.Component {
  state = {
    personelNumber: '',
    password: ''
  }

  _updateMasterState = (attrName, value) => {
    this.setState({ [attrName]: value });
  }

  render() {
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.logo}>خوش‌آمدید</Text>
        <View style={styles.inputView} >
          <FloatingTitleTextInputField
            attrName='personelNumber'
            title='شماره پرسنلی'
            value={this.state.personelNumber}
            updateMasterState={this._updateMasterState}
            // textInputStyles={{ // here you can add additional TextInput styles
            //   color: 'green',
            //   fontSize: 15,
            // }}
          />
        </View>
        <View style={styles.inputView} >
        <FloatingTitleTextInputField
            attrName='password'
            title='رمز عبور'
            value={this.state.password}
            updateMasterState={this._updateMasterState}
            otherTextInputProps={{
              secureTextEntry: true
            }}
          />
        </View>
        <TouchableOpacity>
          <Text style={styles.forgot}>فراموشی گذرواژه</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn} onPress={() => { }} >
          <Text style={styles.loginText}>ورود</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.loginText}>ثبت نام</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: "bold",
    fontSize: 50,
    color: "#fb5b5a",
    marginBottom: 40
  },
  inputView: {
    width: "80%",
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },
  inputText: {
    height: 50,
    color: "white"
  },
  forgot: {
    color: "white",
    fontSize: 11
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#fb5b5a",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10
  },
  loginText: {
    color: "white"
  },
  labelInput: {
    color: 'black',
  },
  formInput: {
    width: '100%',
    borderBottomWidth: 1.5,
    borderColor: '#333',
  },
  input: {
    borderWidth: 0
  },
});