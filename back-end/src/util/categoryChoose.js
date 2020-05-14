export const subjectedToChoose = (subjectedTo) => {
    switch (subjectedTo) {
        case 'all':
            subjectedTo = 'همه';
            break;
        case 'unitBoss':
            subjectedTo = 'رئیس واحد';
            break;
        case 'security':
            subjectedTo = 'اداره کل حراست';
            break;
        case 'headQuartersAndPublicContacts':
            subjectedTo = 'اداره کل حوزه ریاست و روابط عمومی';
            break;
        case 'developmentAndResourceManagement':
            subjectedTo = 'معاونت توسعه و مدیریت منابع';
            break;
        case 'educationDeputy':
            subjectedTo = 'معاونت آموزشی';
            break;
        case 'searchAndTechnologyDeputy':
            subjectedTo = 'معاونت پژوهش و فناوری';
            break;
        case 'studentsAndCulturalDeputy':
            subjectedTo = 'معاونت دانشجویی و فرهنگی';
            break;
        case 'foreignStudentsAttractionAndGuidance':
            subjectedTo = 'دفتر جذب و هدایت دانشجویان غیر ایرانی';
            break;
        case 'samaDeputy':
            subjectedTo = 'معاونت سما';
            break;
        default:
            subjectedTo = 'همه'
    }
    return subjectedTo;
}

export const toCategoryChoose = (toCategory) => {
    switch (toCategory) {
        case 'all':
            toCategory = 'همه';
            break;
        case 'phd':
            toCategory = 'دکتری'
            break;
        case 'ma':
            toCategory = 'کارشناسی ارشد';
            break;
        case 'bc':
            toCategory = 'کارشناسی';
            break;
        default:
            toCategory = 'همه';
    }
    return toCategory;
}
