/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-community/picker';
import EModal from './EModal';
import chevronBottom from '../assets/images/chevronBottom.png';
import { Shape, Colors, Styles } from '../assets/styles/base';
import moment from 'jalali-moment';
import Label from './Input/InputLabel';
import BaseInput from './Input/BaseInput';

const jalaliMonths = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

export default class DatePicker extends Component {
  state = {
    date: moment(),
    focused: false,
    monthPickerItems: [],
    visible: false,
    yearPickerItems: [],
  };

  constructor(props) {
    super(props);
    this.toggleModal = this.toggleModal.bind(this);
  }

  get date() {
    const { selectedValue } = this.props;
    if (selectedValue !== '') {
      return selectedValue && moment(selectedValue).format('jYYYY/jM/jD');
    }
  }

  componentDidMount() {
    this.setState({
      monthPickerItems: this.renderMonthPickerItems(),
      yearPickerItems: this.renderYearPickerItems(),
    });
  }

  handleChange(type) {
    return v => {
      this.setState({ date: this.state.date["j" + type](v) });
    };
  }

  onSelect() {
    const { onSelect } = this.props;
    if (onSelect) {
      onSelect(this.state.date.toDate());
    }
    this.toggleModal();
  }

  renderDayPickerItems() {
    const { date } = this.state;
    const daysInMonth = date.jDaysInMonth();
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days.map((day, index) => (
      <Picker.Item key={index} label={day.toString()} value={day} />
    ));
  }

  renderMonthPickerItems() {
    return jalaliMonths.map((month, index) => (
      <Picker.Item key={index} label={month} value={index} />
    ));
  }

  renderYearPickerItems() {
    const currentYear = moment().jYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 100; i -= 1) {
      years.push(i);
    }
    return years.map((year, index) => (
      <Picker.Item key={index} label={year.toString()} value={year} />
    ));
  }

  toggleModal() {
    const { date, visible } = this.state;
    this.setState({ visible: !visible }, () => {
      const selectedValue = this.props.selectedValue;
      if (selectedValue !== '') {
        if (visible && !date.isSame(selectedValue)) {
          this.setState({ date: moment(selectedValue) });
        }
      }
    });
  }

  picker() {
    const { date, monthPickerItems, yearPickerItems, visible } = this.state;
    const { placeholder } = this.props;
    return (
      <EModal withoutHelp visible={visible} onPress={this.toggleModal}>
        <View style={styles.pickerHeader}>
          <Text style={Styles.placeholder}>{placeholder}</Text>
          <TouchableOpacity onPress={this.onSelect.bind(this)}>
            <Text style={styles.select}>تایید</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.pickerContainer}>
          <Picker
            mode="dropdown"
            selectedValue={date.jDate()}
            style={styles.pickerStyle}
            itemStyle={styles.pickerItemStyle}
            onValueChange={this.handleChange('Date')}
            children={this.renderDayPickerItems()}
          />
          <Picker
            mode="dropdown"
            selectedValue={date.jMonth()}
            style={styles.pickerStyle}
            itemStyle={styles.pickerItemStyle}
            onValueChange={this.handleChange('Month')}
            children={monthPickerItems}
          />
          <Picker
            mode="dropdown"
            selectedValue={date.jYear()}
            style={styles.pickerStyle}
            itemStyle={styles.pickerItemStyle}
            onValueChange={this.handleChange('Year')}
            children={yearPickerItems}
          />
        </View>
      </EModal>
    );
  }

  render() {
    const { error, label, pickerRef } = this.props;
    return (
      <TouchableHighlight
        activeOpacity={0}
        underlayColor="rgba(255,255,255,0)"
        onPress={this.toggleModal}>
        <React.Fragment>
          {this.picker()}
          <BaseInput
            error={error}
            focused={!!this.date}
            icon={<Image source={chevronBottom} style={styles.icon} />}
            label={label}
          >
            <TouchableWithoutFeedback ref={pickerRef} onPress={this.toggleModal}>
              <View style={styles.root}>
                <Text style={styles.placeholder}>{this.date}</Text>
              </View>
            </TouchableWithoutFeedback>
          </BaseInput>
        </React.Fragment>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  pickerHeader: {
    alignItems: 'center',
    borderBottomColor: Colors.midGray,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: Shape.spacing(),
    paddingHorizontal: Shape.spacing(2),
    paddingTop: Shape.spacing(1.5),
  },
  pickerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: Platform.OS === 'android' ? Shape.spacing(2) : 0,
  },
  icon: {
    width: 17,
    height: 17,
  },
  root: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  placeholder: {
    ...Styles.placeholder,
    marginLeft: Shape.spacing(),
  },
  pickerStyle: {
    flex: 1,
  },
  pickerItemStyle: {
    fontFamily: 'Samim-FD',
    fontSize: 16,
  },
  selectedValueStyle: {
    textAlign: 'justify',
    writingDirection: 'rtl',
    fontFamily: 'Samim-FD',
    fontSize: 16,
    paddingLeft: 10,
  },
  fieldsView: {
    backgroundColor: Colors.lightgrey,
    marginBottom: 10,
    minHeight: 60,
    justifyContent: 'space-between',
  },
  select: {
    ...Styles.normalText,
    color: Colors.primary,
  },
});
