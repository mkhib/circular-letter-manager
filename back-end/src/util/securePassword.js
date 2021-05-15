import CryptoJS from 'react-native-crypto-js';

const key = 'wopakeiowp@9403-092i4qwoskidCFAfdowkidrf[$%otp0[awos[dfaswoawrAWDW%&^&*^REWSR#$@^$TREbeqwaE';

export const encrypt = (pass) => {
    return CryptoJS.AES.encrypt(pass, key).toString();
}

export const decrypt = (pass) => {
    let bytes = CryptoJS.AES.decrypt(pass, key);
    return bytes.toString(CryptoJS.enc.Utf8);
}