// import TrezSmsClient from 'trez-sms-client';
// import Users from '../models/user';

// const client = new TrezSmsClient("Javadeb", "Page7515");
// export const sendSMS = async (id, phoneNumber) => {
//     const rndPassword = randomstring.generate(8);
//     const password = await hashPassword(rndPassword);
//     await Users.findByIdAndUpdate(args.id, { authorized: true, password }, { upsert: true, new: true });
//     client.manualSendCode(phoneNumber, `رمزعبور موقت شما برای ورود به سامانه‌ی جستجوی بخشنامه ها: ${rndPassword}`)
//         .then((messageId) => {
//             console.log(`Sent message ID: ${messageId}`)
//         }).catch(error => console.log(error));
//     return true;
// }

import Kavenegar from 'kavenegar';
import randomstring from 'randomstring';
import Users from '../models/user';
import { hashPassword } from './hashPassword';

const api = Kavenegar.KavenegarApi({ apikey: '4A724F7A44645A6B5A71666657664E5051424547316C42376841644B476F55466332514B594A364334394D3D' });
export const sendSMS = async (id, phoneNumber) => {
    const rndPassword = randomstring.generate(8);
    const password = await hashPassword(rndPassword);
    await Users.findByIdAndUpdate(id, { authorized: true, password, changedPassword: false }, { upsert: true, new: true });
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