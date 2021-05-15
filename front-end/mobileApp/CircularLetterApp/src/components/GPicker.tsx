/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  FlatList,
  Image,
  TouchableHighlight,
  ViewStyle,
} from 'react-native';
import Colors from '../constants/Colors';
import EModal from './EModal';
import Layout from '../constants/Layout';
import Styles from '../constants/Styles';
import { Shape } from '../assets/styles/base';

export default class GPicker extends Component<GPickerProps> {
  constructor(props: any) {
    super(props);
    this.setModalVisible = this.setModalVisible.bind(this);
  }

  state = {
    modalVisible: false,
  };

  setModalVisible() {
    const { modalVisible } = this.state;
    this.setState({ modalVisible: !modalVisible });
  }

  keyExtractor = (item: { value: string; }) => item.value;

  borderError = () => {
    const { errors, name } = this.props;
    if (errors.has(name)) {
      return { borderColor: Colors.secondary, borderWidth: 1 };
    }
    return null;
  }

  picker() {
    const { modalVisible } = this.state;
    const {
      placeholder,
      selectedValue,
      items,
      func,
      withoutHelp,
      botBoxText1,
      botBoxButtonText,
      botBoxText2,
      botBoxIcon,
    } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <EModal
          withoutHelp={withoutHelp}
          visible={modalVisible}
          onPress={this.setModalVisible}
          botBoxText1={botBoxText1}
          botBoxText2={botBoxText2}
          botBoxButtonText={botBoxButtonText}
          botBoxIcon={botBoxIcon}
        >
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: Colors.midgrey,
              paddingBottom: 10,
              paddingTop: 15,
              paddingHorizontal: 10,
            }}
          >
            <Text style={[styles.placeholderStyle]}>
              {placeholder}
            </Text>
          </View>
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <TouchableHighlight
                underlayColor={Colors.midgrey}
                activeOpacity={0.5}
                onPress={() => {
                  func(item.label, item.value);
                  setTimeout(() => {
                    this.setModalVisible();
                  }, 200);
                }}
              >
                <View
                  key={item.value}
                  style={StyleSheet.flatten([styles.listItemView, { backgroundColor: selectedValue === item.value && Colors.midgrey }]) as ViewStyle}
                >
                  <View style={{ marginLeft: 20 }}>
                    <Text style={styles.listItemText}>{item.label}</Text>
                  </View>
                </View>
              </TouchableHighlight>
            )}
            keyExtractor={this.keyExtractor}
          />
        </EModal>
        <TouchableWithoutFeedback
          onPress={() => {
            this.setModalVisible();
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <Text style={[selectedValue === '' ? styles.placeholderStyle : styles.selectedValueStyle, { flex: 1 }]}>
              {selectedValue === '' ? placeholder : this.valueFinder(selectedValue)}
            </Text>
            <View
              style={styles.fieldsLeftIcon}
            >
              <Image
                source={require('../assets/images/chevronBottom.png')}
                style={{ width: 17, height: 17 }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  valueFinder(value: string) {
    const { items } = this.props;
    return items.map((data: { value: string, label: string }) => {
      if (data.value === value) {
        return data.label;
      } return null;
    });
  }

  render() {
    const { fieldStyle } = this.props;
    return (
      <View style={[styles.fieldsView, this.borderError(), fieldStyle]}>
        {this.picker()}
      </View>
    );
  }
}

interface GPickerProps {
  errors: any;
  name?: string;
  fieldStyle?: ViewStyle;
  style?: any;
  items: Array<{ label: string, value: string }>;
  placeholder: string;
  selectedValue: string;
  func: any;
  withoutHelp?: boolean;
  botBoxText1?: string;
  botBoxButtonText?: string;
  botBoxText2?: string;
  botBoxIcon?: any;
}

const styles = StyleSheet.create({
  fieldsView: {
    borderWidth: 1,
    borderRadius: Styles.defaultBorderRadius,
    overflow: 'hidden',
    borderColor: Colors.border,
    backgroundColor: 'white',
    flexDirection: 'row',
    minHeight: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldsLeftIcon: {
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(150,150,150,0.6)',
    width: 40,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectedValueStyle: {
    textAlign: 'justify',
    writingDirection: 'rtl',
    fontFamily: 'Samim-FD',
    fontSize: 13,
    paddingHorizontal: 10
  },
  listItemView: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 2.5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(200,200,200,0.4)',
    height: 45,
    alignItems: 'center'
  },
  listItemText: {
    textAlign: 'justify',
    writingDirection: 'rtl',
    fontFamily: 'Samim-FD',
    fontSize: 15,
    includeFontPadding: false
  },
  placeholderStyle: {
    textAlign: 'justify',
    writingDirection: 'rtl',
    fontFamily: 'Samim-FD',
    fontSize: Layout.isSmallDevice ? 12 : 13,
    color: 'rgb(110,110,110)',
    paddingHorizontal: Shape.spacing(),
  },
});
