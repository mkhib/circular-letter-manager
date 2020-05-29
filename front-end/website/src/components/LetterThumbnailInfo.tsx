import React from 'react';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { setAnyThing } from '../redux/slices/data';

const useStyles = makeStyles(theme => ({
  wholeButton: {
    width: 300,
    marginBottom: 20,
  },
  container: {
    fontFamily: 'FontNormalFD'
  },
  imageThumbnail: {
    height: 256,
    width: 192,
  },
}));

const handleNumber = (numberToProcess: string) => {
  if (numberToProcess) {
    const numberToShow: Array<any> = [];
    const numberParts = numberToProcess.split('/');
    numberParts.forEach((part: string, index: number) => {
      numberToShow.push(
        <Box
          key={index.toString()}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {index !== 0 && <Box>
            /
          </Box>}
          <Box>
            {part}
          </Box>
        </Box>
      );
    });
    return numberToShow.map((number: any) => {
      return number;
    });
  }
}

const LetterThumbnailInfo = ({ title, date, files, from, id, setAnyThing, number }: any) => {
  const classes = useStyles();
  return (
    <Button
      onClick={() => {
        setAnyThing({
          theThing: 'requestedLetter',
          data: id
        });
      }}
      className={classes.wholeButton}
      href={`/letter?id=${id}`}
    >
      <Box className={classes.container}>
        <img className={classes.imageThumbnail} src={files[0]} alt="thumbnail" />
        <Box style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent:'center',
        }}>
          {title}
          <Box style={{
            marginLeft: 5
          }}>
            :
          </Box>
          <Box>
            عنوان
          </Box>
        </Box>
        <Box>
          تاریخ: {date}
        </Box>
        <Box style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {handleNumber(number)}
          <Box style={{ marginLeft: 5 }}>
            :شماره
          </Box>
        </Box>
        <Box style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent:'center',
        }}>
          {from}
          <Box style={{
            marginLeft: 5
          }}>
            :
          </Box>
          <Box>
            صادرکننده
          </Box>
        </Box>
      </Box>
    </Button>
  );
}


export default connect(null, {
  setAnyThing
})(LetterThumbnailInfo);