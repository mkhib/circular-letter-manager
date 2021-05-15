/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import Card from './Card';
import Button, { IButtonProps } from './Button';
import Modal from './Modal';
import { Text, View, StyleSheet } from 'react-native';
import { Styles, Shape, Colors } from '../assets/styles/base';

class Alert extends Component<{}, IAlertState> {
  static alert(
    title = '',
    message = '',
    buttons: Buttons = [{}],
    { cancelable = true, closable = true } = {
      cancelable: true,
      closable: true,
    },
  ) {
    ((this as unknown) as Alert).setState({
      cancelable,
      closable,
      values: { buttons, message, title },
      visible: true,
    });
  }

  constructor(props: {}) {
    super(props);
    this.state = {
      cancelable: true,
      closable: true,
      noActions: false,
      visible: false,
      values: { buttons: [{}], message: '', title: '' },
    };
    Alert.alert = Alert.alert.bind(this);
  }

  handleBackdropPress() {
    const { cancelable } = this.state;
    if (cancelable) {
      this.hideAlert();
    }
  }

  handlePress(onPress?: () => void) {
    return () => {
      if (onPress) {
        onPress();
      }
      if (this.state.closable) {
        this.hideAlert();
      }
    };
  }

  hideAlert() {
    this.setState({ visible: false });
  }

  renderButtons() {
    const { buttons } = this.state.values;
    return buttons
      .reverse()
      .map(({ text = 'باشه', onPress, style = 'default' }, i) => (
        <Button
          key={i}
          styles={{ root: styles.button }}
          color={style}
          text={text}
          onPress={this.handlePress(onPress)}
        />
      ));
  }

  renderTitle() {
    const { title } = this.state.values;
    if (title) {
      return <Text style={styles.title} children={title} />;
    }
  }

  render() {
    const {
      visible,
      values: { message },
    } = this.state;
    return (
      <Modal
        style={styles.modal}
        visible={visible}
        onBackdropPress={this.handleBackdropPress.bind(this)}
      >
        <Card>
          {this.renderTitle()}
          <Text style={styles.message} children={message} />
          <View style={styles.buttons} children={this.renderButtons()} />
        </Card>
      </Modal>
    );
  }
}

export default Alert;

const styles = StyleSheet.create({
  button: {
    flex: 1,
    margin: Shape.spacing(0.5),
  },
  buttons: {
    flexDirection: 'row',
    margin: Shape.spacing(0.5),
  },
  message: {
    ...Styles.normalText,
    padding: Shape.spacing(),
    textAlign: "justify",
  },
  modal: {
    ...Styles.screen,
    backgroundColor: undefined,
    justifyContent: "center",
  },
  title: {
    ...Styles.titleText,
    borderBottomWidth: 1,
    borderColor: Colors.midGray,
    padding: Shape.spacing(),
  },
});

interface IAlertState {
  cancelable: boolean;
  noActions: boolean;
  closable: boolean;
  values: {
    buttons: Buttons;
    message: string;
    title: string;
  };
  visible: boolean;
}

type Buttons = Array<{
  text?: string;
  onPress?: () => void;
  style?: IButtonProps['color'];
}>;
