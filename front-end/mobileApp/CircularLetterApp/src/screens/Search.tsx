import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { CheckBox } from 'react-native-elements';
import LottieView from 'lottie-react-native';
import { colors, gStyles, shape } from '../assets/styles/Styles';
import moment from 'jalali-moment';
import DatePicker from '../components/DatePicker';
import GPicker from '../components/GPicker';
import LetterThumbnail from '../components/LetterThumbnail';

const SORTS = [
  {
    label: 'تاریخ افزوده شدن',
    value: 'dateOfCreation',
  },
  {
    label: 'عنوان',
    value: 'title',
  },
  {
    label: 'تاریخ بخشنامه',
    value: 'date',
  },
];

const ORDERS = [
  {
    label: 'صعودی',
    value: 'asc',
  },
  {
    label: 'نزولی',
    value: 'desc',
  },
];

const MOCK_DATA = [
  {
    image: 'https://cdn.yjc.ir/files/fa/news/1398/12/10/11463965_147.jpg',
    title: 'عنوان 2',
    date: '1399/3/2',
    sender: 'اصغر',
    number: '65/ص/45/23',
  },
  {
    image: 'https://cdn.yjc.ir/files/fa/news/1398/12/10/11463965_147.jpg',
    title: 'عنوان 2',
    date: '1399/3/2',
    sender: 'اصغر',
    number: '23/ص/43/56',
  },
  {
    image: 'https://cdn.yjc.ir/files/fa/news/1398/12/10/11463965_147.jpg',
    title: 'عنوان 2',
    date: '1399/3/2',
    sender: 'اصغر',
    number: '23/ص/43/56',
  },
  {
    image: 'https://cdn.yjc.ir/files/fa/news/1398/12/10/11463965_147.jpg',
    title: 'عنوان 2',
    date: '1399/3/2',
    sender: 'اصغر',
    number: '23/ص/43/56',
  },
  {
    image: 'https://cdn.yjc.ir/files/fa/news/1398/12/10/11463965_147.jpg',
    title: 'عنوان 2',
    date: '1399/3/2',
    sender: 'اصغر',
    number: '23/ص/43/56',
  }, {
    image: 'https://cdn.yjc.ir/files/fa/news/1398/12/10/11463965_147.jpg',
    title: 'عنوان 2',
    date: '1399/3/2',
    sender: 'اصغر',
    number: '23/ص/43/56',
  }, {
    image: 'https://cdn.yjc.ir/files/fa/news/1398/12/10/11463965_147.jpg',
    title: 'عنوان 2',
    date: '1399/3/2',
    sender: 'اصغر',
    number: '23/ص/43/56',
  },
];

const Search = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [fromDateToShow, setFromDateToShow] = useState<string>('');
  const [fromDateToSend, setFromDateToSend] = useState<string>('');
  const [toDateToShow, setToDateToShow] = useState<string>('');
  const [toDateToSend, setToDateToSend] = useState<string>('');
  const [dateCheck, setDateCheck] = useState<boolean>(false);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<string>('');
  const [err, setErr] = useState(new Set());
  return (
    <>
      <FlatList
        style={styles.flatListStyle}
        contentContainerStyle={styles.container}
        data={MOCK_DATA}
        keyExtractor={(_item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <LetterThumbnail
              date={item.date}
              image={item.image}
              number={item.number}
              sender={item.sender}
              title={item.title}
            />
          );
        }}
        ListHeaderComponent={
          <View>
            <View style={styles.cardStyle}>
              <View style={styles.serachView}>
                <TextInput
                  value={searchValue}
                  placeholder="جست و جو در بخشنامه‌ها"
                  onChangeText={setSearchValue}
                  returnKeyType="go"
                  returnKeyLabel="go"
                  style={styles.searchInput}
                />
                <TouchableOpacity>
                  <MaterialIcons
                    name="search"
                    size={shape.iconSize}
                    style={styles.searchIcon}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.pickersView}>
                <View style={StyleSheet.flatten([styles.gpickerFieldStyle, { marginRight: shape.spacing(0.25) }])}>
                  <GPicker
                    items={SORTS}
                    withoutHelp
                    selectedValue={sort}
                    func={(label: string, value: string) => setSort(value)}
                    placeholder="مرتب سازی بر اساس"
                    errors={err}
                  />
                </View>
                <View style={StyleSheet.flatten([styles.gpickerFieldStyle, { marginLeft: shape.spacing(0.25) }])}>
                  <GPicker
                    items={ORDERS}
                    withoutHelp
                    selectedValue={order}
                    func={(label: string, value: string) => setSort(value)}
                    placeholder="نوع مرتب سازی"
                    errors={err}
                  />
                </View>
              </View>
              <View style={styles.checkBoxContainer}>
                <CheckBox
                  // center
                  iconRight
                  checkedColor="white"
                  onPress={() => {
                    setDateCheck(!dateCheck);
                    setToDateToSend('');
                    setToDateToShow('');
                    setFromDateToSend('');
                    setFromDateToShow('');
                  }}
                  checked={dateCheck}
                />
                <Text style={styles.searchInDateText}>
                  جست و جو در بازه تاریخ
              </Text>
              </View>
              {dateCheck && <View style={styles.dateContainer}>
                <View style={styles.dateView}>
                  <DatePicker
                    label="از تاریخ"
                    selectedValue={fromDateToShow}
                    onSelect={(date: any) => {
                      let m = moment(date);
                      m.locale('fa');
                      setFromDateToShow(date);
                      setFromDateToSend(m.format('jYYYY/jMM/jDD'));
                    }
                    }
                  />
                </View>
                {/* <View>
          <Text style={styles.tillText}>
            تا
          </Text>
        </View> */}
                <View style={styles.dateView}>
                  <DatePicker
                    label="تا تاریخ"
                    selectedValue={toDateToShow}
                    onSelect={(date: any) => {
                      let m = moment(date);
                      m.locale('fa');
                      setToDateToShow(date);
                      setToDateToSend(m.format('jYYYY/jMM/jDD'));
                    }
                    }
                  />
                </View>
              </View>}
            </View>
          </View>
        }
      />
      {/* <View
      style={styles.lottieView}
    >
      <LottieView
        source={require('../assets/animations/paperLoading.json')}
        autoPlay
        loop
      />
    </View> */}
    </>
  );
};

export default Search;

const styles = StyleSheet.create({
  lottieView: {
    flex: 1,
    backgroundColor: colors.indigo,
  },
  flatListStyle: {
    flex: 1,
    backgroundColor: colors.indigo,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: shape.spacing(0.5),
    width: '100%',
  },
  cardStyle: {
    // backgroundColor: colors.indigo,
    padding: shape.spacing(),
    paddingTop: shape.spacing(1.5),
  },
  gpickerFieldStyle: {
    width: '49%',
  },
  pickersView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  searchInDateText: {
    ...gStyles.normalText,
    color: 'white',
    marginBottom: shape.spacing(),
  },
  container: {
    // ...gStyles.container,
    // paddingTop: shape.spacing(),
    backgroundColor: colors.indigo,
  },
  searchIcon: {
    color: 'white',
    marginBottom: shape.spacing(),
    marginLeft: shape.spacing(0.5),
  },
  serachView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  searchInput: {
    ...gStyles.textInput,
    borderWidth: 1,
    borderColor: '#bdbdbd',
    borderRadius: 7,
    flex: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginLeft: shape.spacing(),
    justifyContent: 'space-between',
    width: '100%',
  },
  tillText: {
    ...gStyles.normalText,
    marginHorizontal: shape.spacing(),
    marginBottom: shape.spacing(),
  },
  dateView: {
    width: '49%',
  },
});
