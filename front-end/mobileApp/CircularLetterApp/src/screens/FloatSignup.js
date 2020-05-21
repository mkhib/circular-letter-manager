import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import { FloatingTitleTextInputField } from '../components/floating_title_text_input_field';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class Signup extends React.Component {
    state = {
        firstName: '',
        lastName: '',
        personelNumber: '',
        identificationNumber: '',
        phoneNumber: ''
    }
    _updateMasterState = (attrName, value) => {
        this.setState({ [attrName]: value });
    }
    onChangeText = (key, val) => {
        this.setState({ [key]: val })
    }
    signUp = async () => {
        const { firstName, lastName, personelNumber, identificationNumber, phoneNumber } = this.state
    }

    render() {
        return (
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps={'handled'}
                contentContainerStyle={styles.container}
            >
                <FloatingTitleTextInputField
                    attrName='firstName'
                    title='نام'
                    value={this.state.firstName}
                    updateMasterState={this._updateMasterState}
                />
                <FloatingTitleTextInputField
                    attrName='lastName'
                    title='نام خانوادگی'
                    value={this.state.lastName}
                    updateMasterState={this._updateMasterState}
                />
                <FloatingTitleTextInputField
                    attrName='personelNumber'
                    title='شماره پرسنلی'
                    value={this.state.personelNumber}
                    updateMasterState={this._updateMasterState}
                />
                <FloatingTitleTextInputField
                    attrName='identificationNumber'
                    title='شماره ملی'
                    value={this.state.identificationNumber}
                    updateMasterState={this._updateMasterState}
                />
                <FloatingTitleTextInputField
                    attrName='phoneNumber'
                    title='شماره موبایل'
                    value={this.state.phoneNumber}
                    updateMasterState={this._updateMasterState}
                />
                <View style={styles.secondContainer}>
                    <TouchableOpacity
                        onPress={() => { }}
                        style={styles.buttonStyle}
                    >
                        <Text style={styles.textStyle}>
                            ثبت نام
                    </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        )
    }
}

export default Signup;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#87CEEB',
        alignItems: 'center',
        width: '100%'
    },
    labelInput: {
        color: 'black',
    },
    formInput: {
        width: '100%',
        borderBottomWidth: 1.5,
        marginLeft: 20,
        borderColor: '#333',
    },
    input: {
        borderWidth: 0
    },
    buttonStyle: {
        width: "80%",
        backgroundColor: "#fb5b5a",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 10
    },
    textStyle: {
        alignSelf: 'center',
        color: '#007aff',
        fontSize: 16,
        fontWeight: '600',
        paddingTop: 10,
        paddingBottom: 10
    },
    secondContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row'
    },
})