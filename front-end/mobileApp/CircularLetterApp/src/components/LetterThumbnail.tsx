import React, { ReactElement } from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet, Image, ImageBackground } from 'react-native';
import { colors, gStyles, shape } from '../assets/styles/Styles';
import backImage from '../assets/images/letterThumbnailBackground.jpg';

interface ThumbnailProps {
  image: string;
  title: string;
  date: string;
  sender: string;
  number: string;
}

interface LineProps {
  title: string;
  value: string;
}

const handleNumber = (numberToProcess: string) => {
  if (numberToProcess) {
    const numberToShow: Array<ReactElement> = [];
    const numberParts = numberToProcess.split('/');
    numberParts.forEach((part: string, index: number) => {
      numberToShow.push(
        <View
          style={styles.numberContainer}
          key={index.toString()}
        >
          <View>
            <Text style={gStyles.normalText}>
              {part}
            </Text>
          </View>
          {index !== 0 && <View>
            <Text>
              /
            </Text>
          </View>}
        </View>
      );
    });
    return numberToShow.map((number: any) => {
      return number;
    });
  }
};

const Line: React.FC<LineProps> = (props) => (
  <View style={styles.lineContainer}>
    <View>
      <Text style={styles.lineTitle}>
        {props.title}
      </Text>
    </View>
    <View>
      <Text style={styles.lineValue}>
        {props.value}
      </Text>
    </View>
  </View>
);

const LetterThumbnail: React.FC<ThumbnailProps> = (props) => {
  return (
    <TouchableWithoutFeedback>
      <ImageBackground
        source={backImage}
        resizeMode="contain"
        style={{
          flex: 1,
          // width: 100,
          // height: 500,
        }}
      >
        <View style={styles.container}>
          <Image
            resizeMode="contain"
            style={styles.imageStyle}
            source={{ uri: props.image }}
          />
          <Line title="عنوان:" value={props.title} />
          <Line title="تاریخ:" value={props.date} />
          <View style={styles.lineContainer}>
            <View>
              <Text style={styles.lineTitle}>
                شماره:
          </Text>
            </View>
            <View style={StyleSheet.flatten([styles.numberContainer, { flexDirection: 'row-reverse' }])}>
              {handleNumber(props.number)}
            </View>
          </View>
          <Line title="صادر کننده:" value={props.sender} />
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

export default LetterThumbnail;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    // backgroundColor: 'white',
    padding: shape.spacing(),
    borderBottomWidth: 0.5,
  },
  numberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageStyle: {
    width: 192,
    height: 256,
  },
  lineTitle: {
    ...gStyles.normalText,
    color: colors.placeholder,
    marginRight: shape.spacing(),
  },
  lineValue: {
    ...gStyles.normalText,
  },
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // width: 300,
    justifyContent: 'flex-start',
    // backgroundColor: 'red',
  },
});
