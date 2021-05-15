const pickerItems = {
  relations: [
    {
      value: 'father',
      label: 'پدر'
    },
    {
      value: 'mother',
      label: 'مادر'
    },
    {
      value: 'spouse',
      label: 'همسر'
    },
    {
      value: 'child',
      label: 'فرزند'
    },
  ],
  relationsWithoutFather: [
    {
      value: 'mother',
      label: 'مادر'
    },
    {
      value: 'spouse',
      label: 'همسر'
    },
    {
      value: 'child',
      label: 'فرزند'
    },
  ],
  relationsWithoutMother: [
    {
      value: 'father',
      label: 'پدر'
    },
    {
      value: 'spouse',
      label: 'همسر'
    },
    {
      value: 'child',
      label: 'فرزند'
    },
  ],
  relationsWithoutFatherMother: [
    {
      value: 'spouse',
      label: 'همسر'
    },
    {
      value: 'child',
      label: 'فرزند'
    },
  ],
  relationsWithoutSpouse: [
    {
      value: 'father',
      label: 'پدر'
    },
    {
      value: 'mother',
      label: 'مادر'
    },
    {
      value: 'child',
      label: 'فرزند'
    },
  ],
  province: [
    { value: '3', label: 'آذربایجان شرقی' },
    { value: '16', label: 'آذربایجان غربی' },
    { value: '15', label: 'اردبیل' },
    { value: '6', label: 'اصفهان' },
    { value: '31', label: 'البرز' },
    { value: '27', label: 'ایلام' },
    { value: '21', label: 'بوشهر' },
    { value: '1', label: 'تهران' },
    { value: '24', label: 'چهارمحال و بختیاری' },
    { value: '30', label: 'خراسان جنوبی' },
    { value: '7', label: 'خراسان رضوی' },
    { value: '29', label: 'خراسان شمالی' },
    { value: '4', label: 'خوزستان' },
    { value: '12', label: 'زنجان' },
    { value: '9', label: 'سمنان' },
    { value: '26', label: 'سیستان و بلوچستان' },
    { value: '5', label: 'فارس' },
    { value: '8', label: 'قزوین' },
    { value: '10', label: 'قم' },
    { value: '18', label: 'کردستان' },
    { value: '22', label: 'کرمان' },
    { value: '19', label: 'کرمانشاه' },
    { value: '28', label: 'کهگلویه و بویراحمد' },
    { value: '14', label: 'گلستان' },
    { value: '2', label: 'گیلان' },
    { value: '20', label: 'لرستان' },
    { value: '13', label: 'مازندران' },
    { value: '11', label: 'مرکزی' },
    { value: '23', label: 'هرمزگان' },
    { value: '17', label: 'همدان' },
    { value: '25', label: 'یزد' },
  ],
  sexItems: [
    {
      value: 'female',
      label: 'خانم'
    },
    {
      value: 'male',
      label: 'آقا'
    },
    {
      value: 'ratherNotSay',
      label: 'تمایلی برای به اظهار جنسیت خود ندارم.'
    },
  ],
  guild: [
    {
      value: '1',
      label: 'آبکاری (طلا-نیکل-کروم و غیره )',
    },
    {
      value: '2',
      label: 'آتلیه عکاسی و فیلمبرداری',
    },

    {
      value: '3',
      label: 'آرایشگاه آقایان',
    },
    {
      value: '4',
      label: 'آرایشگاه بانوان',
    },
    {
      value: '5',
      label: 'آزمایشگاه تشخیص طبی',
    },
    {
      value: '6',
      label: 'آزمایشگاه طبی و تجهیزات آزمایشگاهی',
    },
    {
      value: '7',
      label: 'خرازی',
    },
    {
      value: '8',
      label: '    خشکبار - قنادی - لوازم قنادی',
    },
    {
      value: '9',
      label: 'خشکشویی و لباسشویی',
    },
    {
      value: '10',
      label: 'داروخانه',
    },
    {
      value: '11',
      label: 'داروهای گیاهی و گیاهان دارویی(عطاری)',
    },
    {
      value: '12',
      label: 'دامپزشکی(دارو ولوازم)',
    },
    {
      value: '13',
      label: 'دخانیات',
    },
    {
      value: '14',
      label: 'فرآورده های پروتئینی',
    },
    {
      value: '15',
      label: 'آرایشی و بهداشتی',
    },
  ],
};

export default pickerItems;
