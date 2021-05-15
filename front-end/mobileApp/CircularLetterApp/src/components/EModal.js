/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import colors from '../constants/Colors';

export default class EModal extends Component {
  state = {
    isModalVisible: false,
  };

  _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });

  render() {
    const {
      children,
      visible,
      onPress,
      withoutHelp,
      style,
      viewStyle,
      maxHeight,
      aniIn,
      aniOut,
      botBoxText1,
      botBoxButtonText,
      botBoxText2,
      botBoxIcon,
    } = this.props;
    return (
      <Modal
        animationIn={aniIn}
        animationOut={aniOut}
        // backdropColor="rgba(74, 74, 74,0.4)"
        isVisible={visible}
        onBackdropPress={onPress}
        style={[{ margin: 0, padding: 0, justifyContent: "flex-end" }, style]}
      >
        <View
          style={[
            {
              backgroundColor: "white",
              borderTopLeftRadius: 2,
              borderTopRightRadius: 2,
              maxHeight: maxHeight || '50%',
              marginHorizontal: 1,
              minHeight: 120,
            },
            viewStyle,
          ]}
        >
          {children}
          {withoutHelp !== true && (
            <View
              style={{
                flexDirection: "row",
                paddingLeft: 10,
                backgroundColor: colors.darkGray,
                height: 40,
                alignItems: "center",
              }}
            >
              {botBoxIcon}
              <Text
                style={{
                  marginLeft: 3,
                  fontFamily: "FontNormal",
                  fontSize: 14,
                  color: "white",
                }}
              >
                {botBoxText1}
              </Text>
              <TouchableOpacity>
                <Text
                  style={{
                    marginLeft: 3,
                    fontFamily: "FontNormal",
                    fontSize: 14,
                    color: colors.secondary,
                  }}
                >
                  {botBoxButtonText}
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  marginLeft: 3,
                  fontFamily: "FontNormal",
                  fontSize: 14,
                  color: "white",
                }}
              >
                {botBoxText2}
              </Text>
            </View>
          )}
        </View>
      </Modal>
    );
  }
}
