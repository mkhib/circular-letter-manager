import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, FlatList, ImageBackground, Keyboard } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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
interface SearchObj {
  searchText: string;
  sort: string;
  order: string;
  startDate: string;
  endDate: string;
}
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
  const [fetchMoreLoading, setFetchMoreLoading] = useState<boolean>(true);
  const [err, setErr] = useState(new Set());
  const [searchObject, setSearchObject] = useState<SearchObj>({
    searchText: '',
    startDate: '',
    endDate: '',
    order: 'desc',
    sort: 'dateOfCreation',
  });
  const [hasMore, setHasMore] = useState(true);
  const { loading, error, data, fetchMore, refetch } = useQuery(SEARCH_QUERY, {
    fetchPolicy: 'network-only',
    variables: {
      information: searchObject.searchText,
      page: 1,
      startDate: searchObject.startDate,
      endDate: searchObject.endDate,
      limit: LIMIT,
      sortBy: searchObject.sort,
      order: searchObject.order,
    },
  });
  React.useEffect(() => {
    if (error) {
      if (error.message === 'GraphQL error: Authentication required') {
        setTimeout(() => Actions.auth(), 0);
      }
    }
  }, [error, fetchMoreLoading]);
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
    if (loading) {
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
  const doSearch = () => {
    setSearchObject({
      searchText: fixNumbers(searchValue),
      endDate: toDateToSend,
      startDate: fromDateToSend,
      order: order,
      sort: sort,
    });
  };
  return (
    <>
      <ImageBackground
        style={{
          flex: 1
        }}
        source={require('../assets/images/searchBack.jpg')}
      >
        <FlatList
          style={styles.flatListStyle}
          contentContainerStyle={styles.container}
          data={handleData()}

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
                  startDate: searchObject.startDate,
                  endDate: searchObject.endDate,
                  limit: LIMIT,
                  sortBy: searchObject.sort,
                  order: searchObject.order,
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
            <View>
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
                      doSearch();
                    }}
                    style={styles.searchInput}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      handleResetPage();
                      Keyboard.dismiss();
                      doSearch();
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
                        doSearch();
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
                        setTimeout(() => doSearch(), 0);
                      }}
                      placeholder="نوع مرتب سازی"
                      errors={err}
                    />
                  </View>
                </View>
                <View style={styles.checkBoxContainer}>
                  <CheckBox
                    // center
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
                        doSearch();
                      }
                      }
                    />
                  </View>
                </View>}
              </View>
            </View>
          }
        />
        {loading && <View
          style={styles.lottieView}
        >
          <LottieView
            source={require('../assets/animations/paperLoading.json')}
            autoPlay
            loop
          />
        </View>}
      </ImageBackground>
    </>
  );
};

export default Search;

const styles = StyleSheet.create({
  lottieView: {
    flex: 1,
    paddingBottom: shape.spacing(),
    // backgroundColor: colors.indigo,
  },
  footerLoading: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  flatListStyle: {
    flex: 1,
    // backgroundColor: colors.indigo,
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
    // color: 'white',
    marginBottom: shape.spacing(),
  },
  alertView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.indigo,
  },
  container: {
    // ...gStyles.container,
    // paddingTop: shape.spacing(),
    // backgroundColor: colors.indigo,
    // backgroundColor: 'red',
  },
  searchIcon: {
    // color: 'white',
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
  emptyView: {
    flex: 1,
    alignSelf: 'center',
  },
  emptyText: {
    ...gStyles.normalText,
    // color: 'white',
    fontSize: 20,
  },
  tryAgainText: {
    ...gStyles.normalText,
    color: 'white',
  },
});
