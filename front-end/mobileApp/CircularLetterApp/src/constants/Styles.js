import Layout from './Layout';
import Colors from './Colors';

const normalText = {
  fontFamily: 'Samim-FD',
  fontWeight: 'normal',
  fontSize: Layout.isSmallDevice ? 15 : 16,
  writingDirection: 'rtl',
};

const boldText = {
  fontFamily: 'Samim-Bold-FD',
  fontSize: 16,
  writingDirection: 'rtl',
  marginBottom: 5,
};

const titleText = {
  fontFamily: 'Samim-Bold-FD',
  fontSize: 17,
  writingDirection: 'rtl',
};
const centerRow = {
  flexDirection: 'row',
  alignItems: 'center',
};

const withBorder = {
  borderColor: Colors.border,
  borderWidth: 0.75,
  borderRadius: 7,
};

const pageTitle = {
  fontFamily: 'Samim-Bold-FD',
  fontSize: 16,
  marginHorizontal: 10,
  marginTop: 15,
  marginBottom: 10,
};

export default {
  normalText,
  defaultHorizPadding: 10,
  defaultVerticPadding: 13,
  defaultIconSize: 26,
  defaultMarginBottom: 8,
  defaultHeaderRadius: 7,
  defaultBorderRadius: 7,
  defaultRowHeight: 50,
  defaultTouchableOpacity: 0.7,
  centerRow,
  boldText,
  titleText,
  withBorder,
  pageTitle,
};
