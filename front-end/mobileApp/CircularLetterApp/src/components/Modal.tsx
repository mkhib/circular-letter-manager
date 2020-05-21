import React, { PropsWithChildren } from 'react';
import { StyleSheet, Modal as NativeModal, View, StyleProp, ViewStyle, TouchableWithoutFeedback } from "react-native";

function Modal(props: PropsWithChildren<IModalProps>) {
  const { children, onBackdropPress, style, visible = false } = props;
  return (
    <NativeModal animationType="fade" transparent={true} visible={visible}>
      <TouchableWithoutFeedback onPress={onBackdropPress} children={<View style={styles.backdrop} />} />
      <View style={style} children={children} />
    </NativeModal>
  );
}

export default Modal;

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'black', opacity: 0.7 },
});

interface IModalProps {
  onBackdropPress?: () => void;
  style?: StyleProp<ViewStyle>;
  visible: boolean;
}
