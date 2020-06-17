import React from 'react';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: 10,
    // width: '20vmax',
    // backgroundColor: 'white',
  },
  innerTxtFields: {
    fontFamily: 'FontNormalFD',
    direction: 'ltr',
    // backgroundColor: 'white',
    // paddingRight: 90,
    // fontSize: '2.1vmin'
  },
  innerText: {
    fontFamily: 'FontNormalFD',
    direction: 'ltr',
    borderRadius: 7,
    backgroundColor: '#fcfcfc',
    // paddingRight: 90,
    // fontSize: '2.1vmin'
  },
  helperText: {
    fontFamily: 'FontNormal',
  },
}));

interface ITextInputProps {
  required: boolean;
  id: string;
  onKeyUp: any;
  error: any;
  label: string;
  defaultValue: any;
  type: string;
  value: string;
  onChange: () => void;
  inputStyle: any;
  lang: string;
}

const TextInput = (props: any) => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <TextField
        required={props.required}
        id={props.id}
        style={props.style}
        helperText={props.helperText}
        FormHelperTextProps={{
          className: classes.helperText
        }}
        onKeyUp={props.onKeyUp}
        error={props.error}
        autoComplete='off'
        label={props.label}
        defaultValue={props.defaultValue}
        type={props.type}
        value={props.value}
        variant={"outlined" || props.variant}
        lang={props.lang}
        onChange={props.onChange}
        InputLabelProps={{
          classes: {
            root: classes.innerTxtFields
          },
        }}
        InputProps={props.inputStyle ? props.inputStyle : {
          classes: {
            input: classes.innerText,
          },
        }}
      />
    </Box>
  );
}

export default TextInput;