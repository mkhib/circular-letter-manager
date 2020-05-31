import React, { Component } from 'react';
import { View, Animated, StyleSheet, TextInput, Text } from 'react-native';
import { string, func, object, number } from 'prop-types';
import { gStyles, colors, shape } from '../assets/styles/Styles';

export class FloatingTitleTextInputField extends Component {
    static propTypes = {
        attrName: string.isRequired,
        title: string.isRequired,
        value: string.isRequired,
        helperText: string,
        keyboardType: string,
        titleActiveSize: number, // to control size of title when field is active
        titleInActiveSize: number, // to control size of title when field is inactive
        titleActiveColor: string, // to control color of title when field is active
        titleInactiveColor: string, // to control color of title when field is active
        textInputStyles: object,
        otherTextInputProps: object,
    }
    static defaultProps = {
        keyboardType: 'default',
        titleActiveSize: 11.5,
        titleInActiveSize: 16,
        titleActiveColor: 'black',
        titleInactiveColor: 'dimgrey',
        textInputStyles: {},
        otherTextInputAttributes: {},
    }

    constructor(props) {
        super(props);
        const { value } = this.props;
        this.position = new Animated.Value(value ? 1 : 0);
        this.state = {
            isFieldActive: false,
        };
    }

    _handleFocus = () => {
        if (!this.state.isFieldActive) {
            this.setState({ isFieldActive: true });
            Animated.timing(this.position, {
                toValue: 1,
                duration: 150,
                useNativeDriver: false,
            }).start();
        }
    }

    _handleBlur = () => {
        if (this.state.isFieldActive && !this.props.value) {
            this.setState({ isFieldActive: false });
            Animated.timing(this.position, {
                toValue: 0,
                duration: 150,
                useNativeDriver: false,
            }).start();
        }
    }

    _onChangeText = (updatedValue) => {
        const { attrName, updateMasterState } = this.props;
        updateMasterState(attrName, updatedValue);
    }

    _returnAnimatedTitleStyles = () => {
        const { isFieldActive } = this.state;
        const {
            titleActiveColor, titleInactiveColor, titleActiveSize, titleInActiveSize,
        } = this.props;

        return {
            top: this.position.interpolate({
                inputRange: [0, 1],
                outputRange: [14, 0],
            }),
            fontSize: isFieldActive ? titleActiveSize : titleInActiveSize,
            color: isFieldActive ? titleActiveColor : titleInactiveColor,
        }
    }

    render() {
        const { forwardedRef, ...rest } = this.props;
        return (
            <View>
                <View style={Styles.container}>
                    <Animated.Text
                        style={[Styles.titleStyles, this._returnAnimatedTitleStyles()]}
                    >
                        {this.props.title}
                    </Animated.Text>
                    <TextInput
                        value={this.props.value}
                        style={[Styles.textInput, this.props.textInputStyles]}
                        ref={forwardedRef}
                        autoCapitalize="none"
                        underlineColorAndroid="transparent"
                        onFocus={this._handleFocus}
                        returnKeyType={this.props.returnKeyType}
                        returnKeyLabel={this.props.returnKeyLabel}
                        onBlur={this._handleBlur}
                        onSubmitEditing={this.props.onSubmitEditing}
                        onChangeText={(text) => this.props.onChangeText(text)}
                        // onChangeText={this._onChangeText}
                        keyboardType={this.props.keyboardType}
                        {...this.props.otherTextInputProps}
                        {...rest}
                    />
                </View>
                {!!this.props.helperText && <View style={Styles.helperTextView}>
                    <Text style={Styles.helperText}>
                        {this.props.helperText}
                    </Text>
                </View>}
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    container: {
        width: '100%',
        borderBottomWidth: 0.5,
        backgroundColor: 'white',
        // height: 45,
        marginVertical: 4,
    },
    helperText: {
        ...gStyles.normalText,
        color: colors.redAlert,
    },
    helperTextView: {
        marginBottom: shape.spacing(0.5),
        marginLeft: shape.spacing(),
    },
    textInput: {
        fontFamily: 'Vazir-FD',
        fontSize: 16,
        marginTop: 10,
        color: 'black',
    },
    titleStyles: {
        position: 'absolute',
        left: 4,
        // bottom: 24,
        fontFamily: 'Vazir-FD',
        // marginBottom: 10,
        // color: 'white',
    },
});
