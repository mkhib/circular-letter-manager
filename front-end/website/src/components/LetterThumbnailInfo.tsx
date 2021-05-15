import React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  wholeButton: {
    width: 300,
    marginBottom: 20,
  },
  container: {
    fontFamily: 'FontNormalFD',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
const handleDate = (date: string) => {
  const dateAsArray = date.split('-');
  return `${dateAsArray[0]}/${dateAsArray[1]}/${dateAsArray[2]}`;
}
const LetterThumbnailInfo = ({ title, date, files, from, id, number }: any) => {
  const classes = useStyles();
  return (
    <Button
      className={classes.wholeButton}
      href={`/letter?id=${id}`}
    >
      <Box className={classes.container}>
        <img className={classes.imageThumbnail} src={files[0]} alt="thumbnail" />
        <Box style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
          <Box
            style={{
              width: 300,
              overflow: 'hidden',
            }}
          >
            عنوان
            :
          {' '}{title}
          </Box>
        </Box>
        <Box>
          تاریخ : {handleDate(date)}
        </Box>
        <Box style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
          {handleNumber(number)}
          <Box style={{ marginLeft: 2.5 }}>
            : شماره
          </Box>
        </Box>
        <Box style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
          <Box
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <Box>
              صادرکننده
              :
              {' '}{from}
            </Box>
          </Box>
        </Box>
      </Box>
    </Button>
  );
}


export default LetterThumbnailInfo;
