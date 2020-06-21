import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import gql from 'graphql-tag';
import Checkbox from '@material-ui/core/Checkbox';
import Pagination from '@material-ui/lab/Pagination';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import LetterThumbnailInfo from '../components/LetterThumbnailInfo';
import { makeStyles } from '@material-ui/core/styles';
import TextInput from '../components/TextInput';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import { useQuery } from '@apollo/react-hooks';
import DatePickerFarsi from '../components/DatePickerFarsi';
import CircularProgress from '@material-ui/core/CircularProgress';
import Select from '@material-ui/core/Select';
import Tooltip from '@material-ui/core/Tooltip';
import { MenuItem, InputLabel } from '@material-ui/core';
import {
  Redirect,
} from 'react-router-dom';
import {
  setAnyThing,
  changeSearchInDate,
  changeToDateFull,
  changeFromDateFull,
} from '../redux/slices/data';
import {
  useLocation
} from "react-router-dom";
import searchBack from '../assets/images/searchBack.jpg';

const useStyles = makeStyles((theme) => ({
  searchOptions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  searchBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '50vmax',
    // alignItems: 'center',
  },
  letterContainer: {
    display: 'flex',
    flexDirection: 'row-reverse',
    flexWrap: 'wrap'
  },
  searchInDateBox: {
    display: 'flex',
    // width: 1000,
    fontFamily: 'FontNormal',
    minHeight: 60,
    fontSize: 14,
    // backgroundColor: 'red',
  },
  selectDateBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  checkboxView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  searchResultBox: {
    display: 'flex',
    // marginBottom: 10,
    marginLeft: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    fontFamily: 'FontNormalFD',
    // width: '40vmax',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  menuItem: {
    fontFamily: 'FontNormal',
    // fontSize: '2.1vmin',
    direction: 'ltr',
  },
  selectBox: {
    width: 170,
    minWidth: 170,
    // marginBottom: 29,
    marginRight: 20,
  },
  select: {
    width: '100%',
    backgroundColor:'white',
    fontFamily: 'FontNormal',
    // fontSize: '2.1vmin',
    marginBottom: 10,
  },
  selectTopInputLabel: {
    fontFamily: 'FontNormal',
    fontSize: 15,
    marginBottom: 10,
  },
  tipTool: {
    // marginBottom: 15,
    marginLeft: 15,
    fontFamily: 'FontNormalFD'
  },
  tipToolText: {
    fontFamily: 'FontNormalFD',
    textAlign: 'left',
    fontSize: 13,
    padding: 5,
  },
}));

const pageUrl = window.location.href;

const renderLetters = (letters: Array<any>) => {
  return letters.map(({ title, date, from, files, _id, number }) => {
    return <LetterThumbnailInfo
      key={_id}
      files={files}
      title={title}
      date={date}
      from={from}
      number={number}
      id={_id}
    />
  })
}

const SEARCH_QUERY = gql`
query SearchQuery($information: String,$sortBy: String,$order: String, $startDate: String,$endDate: String, $page: Int, $limit: Int){
  search(information: $information,startDate: $startDate,endDate: $endDate, page: $page, limit: $limit, sortBy: $sortBy, order: $order){
    circularLetters{
    _id
    title
    files
    number
    from
    date
    }
    quantity
  }
}
`;

function useQueryParam() {
  return new URLSearchParams(useLocation().search);
}
const SearchLetters = (props: any) => {
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState('');
  const [search, setSearch] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [sort, setSort] = useState('dateOfCreation');
  const [order, setOrder] = useState('desc');
  const [width, setWidth] = useState(window.innerWidth);
  const didMountRef = React.useRef(false);
  let queryParam = useQueryParam();
  const updateWidth = () => {
    setWidth(window.innerWidth);
  };
  const { history } = props;
  useEffect(() => {
    window.addEventListener("resize", updateWidth);
    if (didMountRef.current) {
      history.push(`${window.location.pathname}?page=1&search=${search}&sort=${sort}&order=${order}`)
    } else didMountRef.current = true
    return () => window.removeEventListener("resize", updateWidth);
  }, [search, sort, order, history]);
  const RESPONSIVE_WIDTH2 = 618;
  const RESPONSIVE_WIDTH = 800;
  const handleSearch = () => {
    const search = queryParam.get('search')
    if (search !== null) {
      return search;
    } return '';
  }
  const handlePageNumber = () => {
    const page = queryParam.get('page');
    if (page !== null) {
      return parseInt(page, 10);
    } return 1;
  }
  const handleSort = () => {
    const querySort = queryParam.get('sort');
    if (querySort !== null) {
      return querySort;
    } else {
      return 'dateOfCreation';
    }
  }
  const handleOrder = () => {
    const queryOrder = queryParam.get('order');
    if (queryOrder !== null) {
      return queryOrder;
    } else {
      return 'desc';
    }
  }
  const toolTipText = `
  پس از انتخاب تاریخ بر روی علامت جست و جو کلیک کنید
`;
  const { loading, error, data } = useQuery(SEARCH_QUERY, {
    variables: { information: handleSearch(), startDate: start, endDate: end, page: handlePageNumber(), limit: 12, sortBy: sort, order: order },
  });
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.changeSearchInDate(event.target.checked);
  };
  const doSearch = () => {
    setStart(props.fromDate);
    setEnd(props.toDate);
    props.changeFromDateFull(props.fromDate);
    props.changeToDateFull(props.toDate);
    setSearch(searchValue);
    // props.history.push(`${window.location.pathname}?page=1&search=${searchValue}&sort=${sort}&order=${order}`)
  }
  if (loading) return (
    <Box style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    }}>
      <Backdrop className={classes.backdrop} open>
        <CircularProgress style={{ height: '8vmax', width: '8vmax' }} />
      </Backdrop>
    </Box>
  );
  if (error) {
    if (error.message === 'GraphQL error: Authentication required') {
      return (<Redirect to={{
        pathname: '/login',
      }} />)
    }
    return `Error! ${error}`;
  }
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        paddingTop: 30,
        backgroundImage: `url(${searchBack})`,
        backgroundAttachment: 'fixed',
      }}
    >
      <Box className={classes.searchOptions}>
        <Box className={classes.searchBox} style={{
          flexDirection: width >= RESPONSIVE_WIDTH ? 'row' : 'column-reverse',
          justifyContent: 'center',
          alignItems: width >= RESPONSIVE_WIDTH ? 'center' : '',
        }}>
          <Box style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 29,
          }}>
            <Button
              style={{ height: 60, marginBottom: 10, marginRight: 20 }}
              onClick={() => {
                doSearch();
              }}
            >
              <SearchOutlinedIcon style={{ fontSize: 40 }} />
            </Button>
            <TextInput
              id="refer to"
              style={{ width: '25vmax', minWidth: 200, maxWidth: 500, height: 60 }}
              label="جست و جو"
              value={searchValue}
              onKeyUp={(e: any) => {
                const enterCode = 13;
                if (e.which === enterCode) {
                  doSearch();
                }
              }}
              onChange={(event: { target: HTMLInputElement }) => setSearchValue(event.target.value)}
            />
          </Box>
          <Box style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            // width: 400
          }}>
            <Box className={classes.selectBox} style={{ minWidth: 110, width: 110 }}>
              <InputLabel className={classes.selectTopInputLabel} id="sortBy">
                :نوع
              </InputLabel>
              <Select
                id="order"
                className={classes.select}
                value={order}
                variant="outlined"
                labelId="label"
                onChange={(event: any) => {
                  setOrder(event.target.value);
                  doSearch();
                }}
              >
                {orderList.map((order: { name: string, value: string }, index: number) => (
                  <MenuItem
                    key={index.toString()}
                    className={classes.menuItem}
                    style={{
                      paddingRight: 20,
                    }}
                    value={order.value}
                  >
                    {order.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box className={classes.selectBox}>
              <InputLabel className={classes.selectTopInputLabel} id="sortBy">
                :مرتب سازی براساس
              </InputLabel>
              <Select
                id="sort"
                className={classes.select}
                value={sort}
                variant="outlined"
                labelId="label"
                onChange={(event: any) => {
                  setSort(event.target.value);
                  doSearch();
                }}
              >
                {sortList.map((sort: { name: string, value: string }, index: number) => (
                  <MenuItem
                    key={index.toString()}
                    className={classes.menuItem}
                    style={{
                      paddingRight: 20,
                    }}
                    value={sort.value}
                  >
                    {sort.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
        </Box>
        <Box className={classes.searchInDateBox}
          style={{
            flexDirection: width >= RESPONSIVE_WIDTH ? 'row-reverse' : 'column',
          }}
        >
          <Box className={classes.checkboxView}>
            <Box style={{
              marginLeft: 30
            }}>
              جست و جو در بازه تاریخ
            </Box>
            <Checkbox
              color="primary"
              checked={props.searchInDate}
              onChange={(event) => {
                if (!event.target.checked) {
                  props.setAnyThing({
                    theThing: 'fromDate',
                    data: '',
                  });
                  props.setAnyThing({
                    theThing: 'toDate',
                    data: '',
                  });
                }
                handleChange(event);
              }}
              inputProps={{ 'aria-label': 'بازه تاریخی' }}
            />
          </Box>
          {props.searchInDate && (
            <Box className={classes.selectDateBox}>
              <Tooltip
                arrow
                className={classes.tipTool}
                leaveDelay={400}
                title={
                  <div className={classes.tipToolText}>
                    {toolTipText}
                  </div>
                }
              >
                <InfoOutlinedIcon />
              </Tooltip>
              <Box style={{ marginRight: 10, width: 120 }}>
                <DatePickerFarsi
                  getSelectedDate={(date: string) => {
                    props.setAnyThing({
                      theThing: 'toDate',
                      data: date,
                    });
                  }}
                />
              </Box>
            :تا تاریخ
              <Box style={{ marginLeft: 10, marginRight: 10, width: 120 }}>
                <DatePickerFarsi
                  getSelectedDate={(date: string) => {
                    props.setAnyThing({
                      theThing: 'fromDate',
                      data: date,
                    });
                  }}
                />
              </Box>
            :از تاریخ
            </Box>

          )}
          {(!!props.fromDateFull && !!props.toDateFull) && (
            <Box className={classes.searchResultBox}>
              جست و جو از تاریخ {props.fromDateFull} تا تاریخ {props.toDateFull}
            </Box>
          )}
        </Box>
      </Box>
      <Box
        className={classes.letterContainer}
        style={{
          justifyContent: width < RESPONSIVE_WIDTH2 ? 'center' : 'flex-start',
          alignItems: width < RESPONSIVE_WIDTH2 ? 'flex-start' : 'flex-start',
        }}
      >
        {renderLetters(data.search.circularLetters)}
        {data.search.circularLetters.length === 0 && (
          <Box style={{
            marginTop: 50,
            display: 'flex',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'FontNormal',
          }}>
            .بخشنامه‌ای یافت نشد
          </Box>
        )}
      </Box>
      <Box style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
      }}>
        {data.search.quantity !== 0 && <Pagination
          page={handlePageNumber()}
          count={data.search.quantity}
          style={{ direction: 'rtl', marginTop: 20, marginBottom: 40 }}
          color="primary"
          onChange={(_a, b) => {
            if (handlePageNumber() !== b) {
              props.history.push(`${window.location.pathname}?page=${b}&search=${handleSearch()}&sort=${handleSort()}&order=${handleOrder()}`)
            }
          }}
        />}
      </Box>
    </Box>
  );
}

const mapState = (state: any) => ({
  fromDate: state.mainData.fromDate,
  toDate: state.mainData.toDate,
  searchInDate: state.mainData.searchInDate,
  toDateFull: state.mainData.toDateFull,
  fromDateFull: state.mainData.fromDateFull,
});

export default connect(mapState, {
  setAnyThing,
  changeSearchInDate,
  changeToDateFull,
  changeFromDateFull,
})(SearchLetters as any);

const sortList = [
  {
    value: 'dateOfCreation',
    name: 'تاریخ افزوده شدن',
  },
  {
    value: 'title',
    name: 'عنوان',
  },
  {
    value: 'date',
    name: 'تاریخ بخشنامه'
  },
];

const orderList = [{
  value: 'asc',
  name: 'صعودی',
},
{
  value: 'desc',
  name: 'نزولی',
}
];