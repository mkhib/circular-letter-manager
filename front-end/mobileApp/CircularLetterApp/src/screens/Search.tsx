import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList, ImageBackground, Keyboard } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CheckBox } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';
import LottieView from 'lottie-react-native';
import gql from 'graphql-tag';
import { colors, gStyles, shape } from '../assets/styles/Styles';
import { useQuery } from '@apollo/react-hooks';
import TextAlert from '../components/TextAlert';
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

const EmptySearch = () => (
  <View style={styles.emptyView}>
    <Text style={styles.emptyText}>
      بخشنامه‌ای یافت نشد.
    </Text>
  </View>
);

const SEARCH_QUERY = gql`
query SearchQuery($information: String,$sortBy: String,$order: String, $startDate: String,$endDate: String, $page: Int, $limit: Int){
  appSearch(information: $information,startDate: $startDate,endDate: $endDate, page: $page, limit: $limit, sortBy: $sortBy, order: $order){
    _id
    title
    files
    number
    from
    date
  }
}
`;
var
  persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
  arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g],
  fixNumbers = function (str: any) {
    if (typeof str === 'string') {
      for (var i = 0; i < 10; i++) {
        str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
      }
    }
    return str;
  };
const LIMIT = 15;
const Search = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [fromDateToShow, setFromDateToShow] = useState<string>('');
  const [fromDateToSend, setFromDateToSend] = useState<string>('');
  const [toDateToShow, setToDateToShow] = useState<string>('');
  const [toDateToSend, setToDateToSend] = useState<string>('');
  const [dateCheck, setDateCheck] = useState<boolean>(false);
  const [sort, setSort] = useState<string>('');
  const [order, setOrder] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const flatListRef = useRef<FlatList>(null);
  const [fetchMoreLoading, setFetchMoreLoading] = useState<boolean>(true);
  const [err, setErr] = useState(new Set());
  const [searchObject, setSearchObject] = useState<string>('');
  const [hasMore, setHasMore] = useState(true);
  const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(SEARCH_QUERY, {
    notifyOnNetworkStatusChange: true,
    variables: {
      information: searchObject,
      page: 1,
      startDate: fromDateToSend,
      endDate: toDateToSend,
      limit: LIMIT,
      sortBy: sort,
      order: order,
    },
  });
  React.useEffect(() => {
    if (error) {
      if (error.message === 'GraphQL error: Authentication required') {
        setTimeout(() => Actions.auth(), 0);
      }
    }
  }, [error]);
  if (error) {
    if (error.message === 'Network error: Unexpected token T in JSON at position 0' || error.message === 'Network error: Network request failed' || error.message === 'Network error: Timeout exceeded') {
      return (<View
        style={styles.alertView}
      >
        <TextAlert text="اتصال خود را به اینترنت بررسی کنید." state={true} />
        <TouchableOpacity
          style={gStyles.button}
          onPress={() => {
            refetch();
          }}
        >
          <Text style={styles.tryAgainText}>
            تلاش مجدد
          </Text>
        </TouchableOpacity>
      </View>);
    }
  }
  const handleData = () => {
    if (loading && networkStatus !== 3) {
      return [];
    }
    if (data) {
      return data.appSearch;
    } return [];
  };
  const handleResetPage = () => {
    setPage(1);
    setHasMore(true);
  };
  return (
    <>
      <ImageBackground
        style={styles.imageBackground}
        source={require('../assets/images/searchBack.jpg')}
      >
        <FlatList
          style={styles.flatListStyle}
          data={handleData()}
          ref={flatListRef}
          refreshing={networkStatus === 4}
          onRefresh={() => {
            refetch();
            handleResetPage();
          }}
          onEndReachedThreshold={4}
          keyboardShouldPersistTaps={'handled'}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            (fetchMoreLoading && handleData().length > 0) ?
              <View
                style={styles.footerLoading}
              >
                <LottieView
                  source={require('../assets/animations/loading2.json')}
                  autoPlay
                  loop
                />
              </View> : <View />
          }
          ListEmptyComponent={!loading ? <EmptySearch /> : null}
          onEndReached={() => {
            if (hasMore) {
              setFetchMoreLoading(true);
              fetchMore({
                variables: {
                  information: fixNumbers(searchValue),
                  page: page + 1,
                  startDate: fromDateToSend,
                  endDate: toDateToSend,
                  limit: LIMIT,
                  sortBy: sort,
                  order: order,
                },
                updateQuery: (prev: any, { fetchMoreResult }: any) => {
                  if (fetchMoreResult.appSearch.length === 0) {
                    setFetchMoreLoading(false);
                    setHasMore(false);
                  }
                  if (!fetchMoreResult) {
                    return prev;
                  }
                  return Object.assign({}, prev, {
                    appSearch: [...prev.appSearch, ...fetchMoreResult.appSearch],
                  });
                },
              });
              setPage(page + 1);
            }
          }}
          keyExtractor={(_item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <LetterThumbnail
                id={item._id}
                date={item.date}
                image={item.files[0]}
                number={item.number}
                sender={item.from}
                title={item.title}
              />
            );
          }}
          ListHeaderComponent={
            <View style={styles.cardStyle}>
              <View style={styles.serachView}>
                <TextInput
                  value={searchValue}
                  placeholder="جست و جو در بخشنامه‌ها"
                  onChangeText={(text) => {
                    handleResetPage();
                    setSearchValue(text);
                  }}
                  returnKeyType="go"
                  returnKeyLabel="go"
                  onSubmitEditing={() => {
                    handleResetPage();
                    Keyboard.dismiss();
                    setSearchObject(fixNumbers(searchValue));
                  }}
                  style={styles.searchInput}
                />
                <TouchableOpacity
                  onPress={() => {
                    handleResetPage();
                    Keyboard.dismiss();
                    setSearchObject(fixNumbers(searchValue));
                  }}
                >
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
                    func={(label: string, value: string) => {
                      setHasMore(true);
                      setSort(value);
                    }}
                    placeholder="مرتب سازی بر اساس"
                    errors={err}
                  />
                </View>
                <View style={StyleSheet.flatten([styles.gpickerFieldStyle, { marginLeft: shape.spacing(0.25) }])}>
                  <GPicker
                    items={ORDERS}
                    withoutHelp
                    selectedValue={order}
                    func={(label: string, value: string) => {
                      setHasMore(true);
                      setOrder(value);
                    }}
                    placeholder="نوع مرتب سازی"
                    errors={err}
                  />
                </View>
              </View>
              <View style={styles.checkBoxContainer}>
                <CheckBox
                  iconRight
                  checkedColor="black"
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
          }
        />
        {((loading && networkStatus === 1) || (loading && networkStatus === 4) || (loading && networkStatus === 2)) ? <View
          style={styles.lottieView}
        >
          <LottieView
            source={require('../assets/animations/paperLoading.json')}
            autoPlay
            loop
          />
        </View> : <TouchableOpacity
          onPress={() => {
            flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
          }}
          style={styles.goTopView}>
            <MaterialCommunityIcons
              color="#303030"
              name="arrow-up-bold"
              size={shape.iconSize}
            />
          </TouchableOpacity>}
      </ImageBackground>
    </>
  );
};

export default Search;

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
  },
  goTopView: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    borderWidth: 1,
    borderColor: '#454545',
    borderRadius: shape.borderRadius,
    backgroundColor: 'rgba(207, 207, 207, 0.6)',
  },
  lottieView: {
    flex: 1,
    paddingBottom: shape.spacing(),
  },
  footerLoading: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    alignItems: 'center',
  },
  flatListStyle: {
    flex: 1,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: shape.spacing(0.5),
    width: '100%',
  },
  cardStyle: {
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
    marginBottom: shape.spacing(),
  },
  alertView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.indigo,
  },
  searchIcon: {
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
    paddingLeft: shape.spacing(),
    borderRadius: 7,
    flex: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  emptyView: {
    flex: 1,
    alignSelf: 'center',
  },
  emptyText: {
    ...gStyles.normalText,
    fontSize: 20,
  },
  tryAgainText: {
    ...gStyles.normalText,
    color: 'white',
  },
});
