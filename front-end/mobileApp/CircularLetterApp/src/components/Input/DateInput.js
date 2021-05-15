import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Picker, Image, Platform, Animated } from "react-native";
import chevronBottom from "../../assets/images/chevronBottom.png";
import { Shape, Colors, Styles } from "../../assets/styles/base";
import moment from "jalali-moment";
import BaseInput from "./BaseInput";
import Card from "../Card";
import Modal from "../Modal";

const AnimatedCard = Animated.createAnimatedComponent(Card);

const jalaliMonths = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

class DateInput extends Component {
  static format = "jYYYY/jM/jD";

  constructor(props) {
    super(props);
    this.state = {
      bottom: new Animated.Value(-200),
      date: this.date,
      visible: false,
    };
    this.hideModal = this.hideModal.bind(this);
    this.showModal = this.showModal.bind(this);
    this.showModal = this.showModal.bind(this);
    this.monthPickerItems = this.renderMonthPickerItems();
    this.yearPickerItems = this.renderYearPickerItems();
  }

  get date() {
    const { selectedValue } = this.props;
    return selectedValue ? moment(selectedValue, DateInput.format) : moment();
  }

  handleChange(type) {
    return (v) => {
      this.setState({ date: this.state.date["j" + type](v) });
    };
  }

  onSelect() {
    const { onSelect } = this.props;
    if (onSelect) {
      onSelect(this.state.date.format(DateInput.format));
    }
    this.hideModal();
  }

  renderDayPickerItems() {
    const { date } = this.state;
    const daysInMonth = date.jDaysInMonth();
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days.map((day, index) => <Picker.Item key={index} label={day.toString()} value={day} />);
  }

  renderMonthPickerItems() {
    return jalaliMonths.map((month, index) => <Picker.Item key={index} label={month} value={index} />);
  }

  renderYearPickerItems() {
    const currentYear = moment().jYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 100; i -= 1) {
      years.push(i);
    }
    return years.map((year, index) => <Picker.Item key={index} label={year.toString()} value={year} />);
  }

  hideModal() {
    Animated.timing(this.state.bottom, { toValue: -200, duration: 150 }).start(() => {
      this.setState({ visible: false });
    });
  }

  showModal() {
    this.setState({ visible: !this.state.visible }, () => {
      Animated.timing(this.state.bottom, { toValue: 0 }).start();
      this.setState({ date: this.date });
    });
  }

  picker() {
    const { bottom, date, visible } = this.state;
    const { label } = this.props;
    return (
      <Modal
        style={{ flex: 1, justifyContent: "flex-end", marginHorizontal: 0 }}
        visible={visible}
        onBackdropPress={this.hideModal}
      >
        <AnimatedCard style={{ height: 200, bottom, borderBottomRightRadius: 0, borderBottomLeftRadius: 0 }}>
          <View style={styles.pickerHeader}>
            <Text style={Styles.placeholder}>{label}</Text>
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
              onValueChange={this.handleChange("Date")}
              children={this.renderDayPickerItems()}
            />
            <Picker
              mode="dropdown"
              selectedValue={date.jMonth()}
              style={styles.pickerStyle}
              itemStyle={styles.pickerItemStyle}
              onValueChange={this.handleChange("Month")}
              children={this.monthPickerItems}
            />
            <Picker
              mode="dropdown"
              selectedValue={date.jYear()}
              style={styles.pickerStyle}
              itemStyle={styles.pickerItemStyle}
              onValueChange={this.handleChange("Year")}
              children={this.yearPickerItems}
            />
          </View>
        </AnimatedCard>
      </Modal>
    );
  }

  render() {
    const { error, label, selectedValue } = this.props;
    return (
      <React.Fragment>
        {this.picker()}
        <TouchableOpacity activeOpacity={Shape.touchableOpacity} onPress={this.showModal}>
          <BaseInput
            error={error}
            focused={!!selectedValue}
            icon={<Image source={chevronBottom} style={styles.icon} />}
            label={label}
            children={<Text style={styles.placeholder} children={selectedValue} />}
          />
        </TouchableOpacity>
      </React.Fragment>
    );
  }
}

export default DateInput;

const styles = StyleSheet.create({
  pickerHeader: {
    alignItems: "center",
    borderBottomColor: Colors.midGray,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: Shape.spacing(),
    paddingHorizontal: Shape.spacing(2),
    paddingTop: Shape.spacing(1.5),
  },
  pickerContainer: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  icon: {
    width: 17,
    height: 17,
  },
  placeholder: {
    ...Styles.normalText,
    alignSelf: "flex-start",
  },
  pickerStyle: {
    flex: 1,
  },
  pickerItemStyle: {
    fontFamily: "Samim-FD",
    fontSize: 16,
  },
  selectedValueStyle: {
    textAlign: "justify",
    writingDirection: "rtl",
    fontFamily: "Samim-FD",
    fontSize: 16,
    paddingLeft: 10,
  },
  fieldsView: {
    backgroundColor: Colors.lightgrey,
    marginBottom: 10,
    minHeight: 60,
    justifyContent: "space-between",
  },
  select: {
    ...Styles.normalText,
    color: Colors.primary,
  },
});
