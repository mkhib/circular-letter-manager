import React, { useState, ReactElement, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  Image,
  Modal,
  ImageBackground,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import gql from 'graphql-tag';
import CameraRoll from '@react-native-community/cameraroll';
import RNFetchBlob from 'rn-fetch-blob';
import AndroidOpenSettings from 'react-native-android-open-settings';
import AsyncStorage from '@react-native-community/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Loading from '../components/Loading';
import { useQuery } from '@apollo/react-hooks';
import { gStyles, colors, shape } from '../assets/styles/Styles';
import TextAlert from '../components/TextAlert';
import ImageViewer from 'react-native-image-zoom-viewer';

const LETTER_QUERY = gql`
query QueryLetters($id: ID!){
  circularLetterDetails(id: $id) {
    circularLetter{
    _id
    title
    number
    importNumber
    exportNumber
    referTo
    from
    date
    subjectedTo
    toCategory
    tags
    files
    }
    refrenceId
  }
}
`;

interface LetterProps {
  id: string;
}

interface LineProps {
  title: string;
  value: string | string[];
  style?: StyleProp<ViewStyle>;
}

const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('tok');
    if (value !== null) {
      return value;
    }
  } catch (e) {
    // error reading value
  }
};

const handleNumber = (numberToProcess: string, blueText?: boolean) => {
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
            <Text style={StyleSheet.flatten([gStyles.normalText, blueText && { color: colors.indigo }])}>
              {part}
            </Text>
          </View>
          {index !== 0 && <View>
            <Text style={blueText && { color: colors.indigo }}>
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

interface ImageProp {
  url: string
}

interface CustomImageHeaderProps {
  currentIndex: number | undefined;
  allSize: number | undefined;
}

const CustomImageHeader: React.FC<CustomImageHeaderProps> = ({ allSize, currentIndex = 0 }) => (
  <View style={styles.imageHeaderView}>
    <Text style={styles.imageHeaderText}>
      / {allSize}
    </Text>
    <Text style={styles.imageHeaderText}>
      {currentIndex + 1}{'  '}
    </Text>
  </View>
);


const Letter: React.FC<LetterProps> = ({ id }) => {
  const [visible, setIsVisible] = useState(false);
  const { loading, error, data } = useQuery(LETTER_QUERY, {
    onCompleted: (da: any) => {
      let tempFiles: ImageProp[] = [];
      da.circularLetterDetails.circularLetter.files.forEach((file: string) => {
        tempFiles.push({ url: file });
      });
      setImages(tempFiles);
    },
    onError: (err) => {
      if (err.message === 'GraphQL error: Authentication required') {
        setTimeout(() => Actions.auth(), 0);
      }
    },
    variables: { id: id },
  });
  const [images, setImages] = useState<ImageProp[]>([]);
  const [alertModal, setAlertModal] = useState<boolean>(false);
  const checkAndroidPermission = async () => {
    try {
      const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
      await PermissionsAndroid.request(permission);
      if (await PermissionsAndroid.request(permission) === 'never_ask_again' || await PermissionsAndroid.request(permission) === 'denied') {
        setAlertModal(true);
      }
      Promise.resolve();
    } catch (err) {
      Promise.reject(err);
    }
  };
  const handleTags = (tags: Array<string>) => {
    const tagsToShow: Array<string> = [];
    tags.forEach((tag: string, index: number) => {
      if (index > 0) {
        tagsToShow.push(` - ${tag}`);
      } else {
        tagsToShow.push(`${tag}`);
      }
    });
    return tagsToShow;
  }
  if (loading) {
    return (
      <ImageBackground
        source={require('../assets/images/searchBack.jpg')}
        style={styles.imageBackground}
      >
        <Loading />
      </ImageBackground>
    );
  }
  if (error) {
    if (error.message === 'Network error: Unexpected token T in JSON at position 0' || error.message === 'Network error: Network request failed' || error.message === 'Network error: Timeout exceeded') {
      return (<View
        style={styles.alertView}
      >
        <TextAlert text="اتصال خود را به اینترنت بررسی کنید." state={true} />
      </View>);
    }
  }
  const handleReferTo = (referTo: string, refrenceId: string) => {
    if (!!referTo && !!refrenceId) {
      return (
        <View style={styles.lineContainer}>
          <View>
            <Text style={styles.lineTitle}>
              ارجاع به شماره:
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              Actions.letter({ id: refrenceId });
            }}
          >
            <View style={StyleSheet.flatten([styles.numberContainer, { flexDirection: 'row-reverse', alignItems: 'center' }])}>
              {data && handleNumber(data.circularLetterDetails.circularLetter.referTo, true)}
            </View>
          </TouchableOpacity>
        </View>
      );
    } else if (referTo) {
      return (
        <View style={styles.lineContainer}>
          <View>
            <Text style={styles.lineTitle}>
              ارجاع به شماره:
            </Text>
          </View>
          <View style={StyleSheet.flatten([styles.numberContainer, { flexDirection: 'row-reverse' }])}>
            {data && handleNumber(data.circularLetterDetails.circularLetter.referTo)}
          </View>
        </View>
      );
    }
  };
  if (!data) {
    return <View />;
  }
  if (data) {
    return (
      <ImageBackground
        source={require('../assets/images/searchBack.jpg')}
        style={styles.imageBackground}
      >
        <View style={styles.topView}>
          <Modal
            visible={visible}
            transparent={true}
            onRequestClose={() => setIsVisible(false)}
          >
            <Modal
              visible={alertModal}
              transparent
              animationType="fade"
              onRequestClose={() => { setAlertModal(false); }}
            >
              <View
                style={styles.alertModalView}
              >
                <Text
                  style={styles.alertModalText}
                >
                  لطفا دسترسی لازم را برای ذخیره تصویر، در تنظیمات تلفن همراه خود برای برنامه فراهم کنید.
                </Text>
                <View
                  style={styles.modalButtonsView}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setAlertModal(false);
                      AndroidOpenSettings.appDetailsSettings();
                    }}
                    style={StyleSheet.flatten([gStyles.button, { backgroundColor: 'white' }])}
                  >
                    <Text style={gStyles.normalText}>
                      ورود به تنظیمات
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setAlertModal(false);
                    }}
                    style={StyleSheet.flatten([gStyles.button, { backgroundColor: 'white' }])}
                  >
                    <Text style={gStyles.normalText}>
                      بازگشت
                  </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <ImageViewer
              imageUrls={images}
              swipeDownThreshold={70}
              saveToLocalByLongPress
              onSave={async (url) => {
                if (Platform.OS === 'android') {
                  await checkAndroidPermission();
                }
                const token = await getData();
                let parts = url.split('.');
                let fileExt = parts[parts.length - 1];
                RNFetchBlob
                  .config({
                    fileCache: true,
                    appendExt: fileExt,
                  })
                  .fetch('GET', url, {
                    Authorization: token ? `Bearer ${token}` : '',
                  })
                  .then((res) => {
                    CameraRoll.save(`${res.path()}`, { type: 'photo', album: 'بخشنامه‌ها' });
                  }).catch((e: any) => {
                    console.log(e);
                  });
              }}
              menuContext={{ saveToLocal: 'ذخیره عکس', cancel: 'بازگشت' }}
              onCancel={() => {
                setIsVisible(false);
              }}
              renderHeader={(currentInd) => {
                return (<CustomImageHeader
                  currentIndex={currentInd}
                  allSize={images.length}
                />);
              }}
              renderIndicator={() => {
                return (
                  <View />
                );
              }}
              enableSwipeDown
            />
          </Modal>
          <View
            style={styles.backButtonView}>
            <TouchableOpacity
              style={styles.backButtonView}
              onPress={() => {
                Actions.pop();
              }}
            >
              <Text style={styles.backButtonText}>
                بازگشت
            </Text>
              <MaterialIcons name="arrow-back" size={22} />
            </TouchableOpacity>
          </View>
          <KeyboardAwareScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
          >
            <View style={styles.topCard}>
              {data && <Line title="عنوان:"
                style={styles.topView}
                value={data.circularLetterDetails.circularLetter.title} />}
              {data && <Line title="تاریخ:" value={data.circularLetterDetails.circularLetter.date} />}
              <View style={styles.lineContainer}>
                <View>
                  <Text style={styles.lineTitle}>
                    شماره:
              </Text>
                </View>
                <View style={StyleSheet.flatten([styles.numberContainer, { flexDirection: 'row-reverse' }])}>
                  {data && handleNumber(data.circularLetterDetails.circularLetter.number)}
                </View>
              </View>
              <Line title="صادر کننده:"
                style={styles.topView}
                value={data.circularLetterDetails.circularLetter.from} />
              {(data && !!data.circularLetterDetails.circularLetter.importNumber) &&
                <View style={styles.lineContainer}>
                  <View>
                    <Text style={styles.lineTitle}>
                      شماره ثبت وارده:
              </Text>
                  </View>
                  <View style={StyleSheet.flatten([styles.numberContainer, { flexDirection: 'row-reverse' }])}>
                    {data && handleNumber(data.circularLetterDetails.circularLetter.importNumber)}
                  </View>
                </View>
              }
              {(data && !!data.circularLetterDetails.circularLetter.exportNumber) &&
                <View style={styles.lineContainer}>
                  <View>
                    <Text style={styles.lineTitle}>
                      شماره ثبت صادره:
              </Text>
                  </View>
                  <View style={StyleSheet.flatten([styles.numberContainer, { flexDirection: 'row-reverse' }])}>
                    {data && handleNumber(data.circularLetterDetails.circularLetter.exportNumber)}
                  </View>
                </View>
              }
              {data && <Line title="مرتبط با مقطع:" value={data.circularLetterDetails.circularLetter.toCategory} />}
              {data && <Line title="حوزه مربوطه:" value={data.circularLetterDetails.circularLetter.subjectedTo} />}
              {data && handleReferTo(data.circularLetterDetails.circularLetter.referTo, data.circularLetterDetails.refrenceId)}
              {data && <Line title="کلمات کلیدی:"
                style={styles.topView}
                value={handleTags(data.circularLetterDetails.circularLetter.tags)} />}
              {data && <Line title="تعداد فایل‌ها:" value={data.circularLetterDetails.circularLetter.files.length} />}
            </View>
            <View
              style={styles.imageView}
            >
              {data && <Image
                source={{ uri: data.circularLetterDetails.circularLetter.files[0] }}
                defaultSource={require('../assets/images/imageLoading.png')}
                style={styles.image}
              />}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setIsVisible(true);
                }}
              >
                {data && <Text style={styles.buttonText}>
                  {data.circularLetterDetails.circularLetter.files.length === 1 ? 'مشاهده فایل' : 'مشاهده فایل‌ها'}
                </Text>}
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </ImageBackground>
    );
  } return null;
};

export default Letter;

const styles = StyleSheet.create({
  topView: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
  },
  topCard: {
    borderWidth: 0.5,
    borderRadius: 5,
    paddingVertical: shape.spacing(),
  },
  imageHeaderView: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: shape.spacing(),
  },
  imageHeaderText: {
    ...gStyles.normalText,
    color: 'white',
  },
  backButtonView: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: shape.spacing(0.5),
    marginTop: shape.spacing(0.5),
  },
  backButtonText: {
    ...gStyles.normalText,
    marginRight: shape.spacing(0.5),
  },
  image: {
    width: 192,
    height: 256,
  },
  imageView: {
    alignSelf: 'center',
    marginTop: shape.spacing(2),
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    ...gStyles.button,
    marginTop: shape.spacing(),
  },
  buttonText: {
    ...gStyles.normalText,
    color: 'white',
  },
  numberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    ...gStyles.container,
  },
  contentContainer: {
    padding: shape.spacing(),
  },
  lineTitle: {
    ...gStyles.normalText,
    color: colors.placeholder,
    marginRight: shape.spacing(0.5),
    marginLeft: shape.spacing(),
  },
  alertView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.indigo,
  },
  lineValue: {
    ...gStyles.normalText,
    flex: 1,
  },
  lineContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  alertModalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertModalText: {
    ...gStyles.normalText,
    backgroundColor: 'white',
    padding: shape.spacing(),
  },
  modalButtonsView: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
