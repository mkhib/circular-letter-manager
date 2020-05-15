import TrezSmsClient from 'trez-sms-client';
import Users from '../models/user';

const client = new TrezSmsClient("Javadeb", "Mjeb6960");
export const sendSMS = async (id, phoneNumber) => {
    const rndPassword = randomstring.generate(8);
    const password = await hashPassword(rndPassword);
    await Users.findByIdAndUpdate(args.id, { authorized: true, password }, { upsert: true, new: true });
    client.manualSendCode(phoneNumber, `رمزعبور موقت شما برای ورود به سامانه‌ی جستجوی بخشنامه ها: ${rndPassword}`)
        .then((messageId) => {
            console.log(`Sent message ID: ${messageId}`)
        }).catch(error => console.log(error));
    return true;
}