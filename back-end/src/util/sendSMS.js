import Kavenegar from 'kavenegar';
import fs from 'fs';
import randomstring from 'randomstring';
import moment from 'moment';
import Users from '../models/user';
import { hashPassword } from './hashPassword';

const api = Kavenegar.KavenegarApi({ apikey: '4A724F7A44645A6B5A71666657664E5051424547316C42376841644B476F55466332514B594A364334394D3D' });
export const sendSMS = async (id, phoneNumber) => {
    const rndPassword = randomstring.generate(8);
    console.log(rndPassword);
    fs.appendFileSync('passwords.txt', `${phoneNumber} : ${rndPassword}\n`);
    const password = await hashPassword(rndPassword);
    await Users.findByIdAndUpdate(id, { authorized: true, password, changedPassword: false, timeLimit: moment().unix().toString() }, { upsert: true, new: true });
    api.Send({
        message: `رمزعبور موقت شما برای ورود به سامانه جستجوی بخشنامه ها: ${rndPassword}`,
        sender: "1000596446",
        receptor: phoneNumber
    },
        function (response, status) {
            console.log(response);
            console.log(status);
        });
}