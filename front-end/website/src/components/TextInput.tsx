import React from 'react';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: 10,
    // width: '20vmax',
    // backgroundColor: 'blue',
  },
  innerTxtFields: {
    fontFamily: 'FontNormalFD',
    direction: 'ltr',
    // paddingRight: 90,
    // fontSize: '2.1vmin'
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
        onKeyUp={props.onKeyUp}
        error={props.error}
        autoComplete='off'
        label={props.label}
        defaultValue={props.defaultValue}
        type={props.type}
        value={props.value}
        variant="outlined"
        lang={props.lang}
        onChange={props.onChange}
        InputLabelProps={{
          classes: {
            root: classes.innerTxtFields
          },
        }}
        InputProps={props.inputStyle ? props.inputStyle : {
          classes: {
            input: classes.innerTxtFields,
          },
        }}
      />
    </Box>
  );
}

export default TextInput;