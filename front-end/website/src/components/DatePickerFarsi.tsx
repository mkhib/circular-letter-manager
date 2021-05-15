import React, { useState } from 'react';
import jMoment from 'moment-jalaali';
import { makeStyles, withStyles, Theme, createStyles } from '@material-ui/core/styles';
import JalaliUtils from '@date-io/jalaali';
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: 10,
    },
  }),
);;

const defaultMaterialTheme = createMuiTheme({
  typography: {
    fontFamily: 'FontNormalFD'
  },
});


const MyDatePicker = withStyles((theme: Theme) => ({
  root: {
    fontFamily: 'FontNormalFD',
    backgroundColor: '#fcfcfc',
    borderRadius: 7,
  },
}))(DatePicker);

jMoment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });

function DatePickerFarsi({ getSelectedDate, getFullDate, value }: any) {
  const [selectedDate, handleDateChange] = useState(jMoment());
  const classes = useStyles();
  const handleUnderTen = (number: number) => {
    if (number < 10) {
      return `0${number}`
    } return number
  }
  getSelectedDate(`${jMoment(selectedDate as any).jYear()}/${handleUnderTen(jMoment(selectedDate as any).jMonth() + 1)}/${handleUnderTen(jMoment(selectedDate as any).jDate())}`);
  getFullDate && getFullDate(selectedDate);
  return (
    <ThemeProvider theme={defaultMaterialTheme}>
      <MuiPickersUtilsProvider utils={JalaliUtils} locale="fa">
        <MyDatePicker
          className={classes.root}
          inputVariant="outlined"
          okLabel="تایید"
          cancelLabel="لغو"
          labelFunc={date => (date ? date.format("jYYYY/jMM/jDD") : "")}
          value={value || selectedDate}
          onChange={(date) => {
            (date && handleDateChange(date));
            // getSelectedDate && getSelectedDate(`${jMoment(date as any).jYear()}/${jMoment(date as any).jMonth() + 1}/${jMoment(date as any).jDate()}`);
          }}
        />
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
}

export default DatePickerFarsi;
