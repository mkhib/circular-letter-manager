import React, { ReactElement } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Image,
  ImageBackground,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { colors, gStyles, shape } from '../assets/styles/Styles';
import { Actions } from 'react-native-router-flux';
import backImage from '../assets/images/letterThumbnailBackground.jpg';

interface ThumbnailProps {
  id: string;
  image: string;
  title: string;
  date: string;
  sender: string;
  number: string;
}

interface LineProps {
  title: string;
  value: string;
  style?: StyleProp<ViewStyle>;
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
    <View style={props.style}>
      <Text style={styles.lineValue}>
        {props.value}
      </Text>
    </View>
  </View>
);

const LetterThumbnail: React.FC<ThumbnailProps> = (props) => {
  return (
    <TouchableOpacity
      onPress={() => {
        console.log('farteer');
        Actions.letter({ id: props.id });
      }}
    >
      {/* <ImageBackground
        source={backImage}
        resizeMode="stretch"
        style={styles.imageBackground}
      > */}
      <View style={styles.container}>
        <Image
          resizeMode="contain"
          defaultSource={require('../assets/images/imageLoading.png')}
          style={styles.imageStyle}
          source={{ uri: props.image }}
        />
        <Line title="عنوان:" value={props.title} style={StyleSheet.flatten([{ flex: 1 }])} />
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
        <Line title="صادر کننده:" value={props.sender} style={StyleSheet.flatten([{ flex: 1 }])} />
      </View>
      {/* </ImageBackground> */}
    </TouchableOpacity>
  );
};

export default LetterThumbnail;

const styles = StyleSheet.create({
  container: {
    padding: shape.spacing(),
    borderBottomWidth: 0.5,
  },
  numberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageStyle: {
    alignSelf: 'center',
    width: 192,
    height: 256,
  },
  lineTitle: {
    ...gStyles.normalText,
    color: colors.placeholder,
    marginRight: shape.spacing(0.5),
    marginLeft: shape.spacing(),
  },
  lineValue: {
    ...gStyles.normalText,
    flex: 1,
  },
  lineContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  imageBackground: {
    flex: 1,
  },
});
