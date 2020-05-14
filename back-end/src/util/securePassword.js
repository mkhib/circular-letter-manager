import aes256 from 'aes256';

const key = 'wopakeiowp@9403-092i4qwoskidCFAfdowkidrf[$%otp0[awos[dfaswoawrAWDW%&^&*^REWSR#$@^$TREbeqwaE';
const cipher = aes256.createCipher(key);

export const encrypt = (pass) => {
    return cipher.encrypt(pass);
}

export const decrypt = (pass) => {
    return cipher.decrypt(pass);
}