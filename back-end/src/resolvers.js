import bcrypt from 'bcryptjs';
import fs, { createReadStream, createWriteStream, unlink } from 'fs';
import path from 'path';
import randomstring from 'randomstring';
import { ObjectId } from 'mongodb';
import moment from 'moment';
import Jimp from 'jimp';
import jMoment from 'moment-jalaali';
import { encrypt, decrypt } from './util/securePassword';
import Users from './models/user';
import { hashPassword } from './util/hashPassword';
import generateToken from './util/generateToken';
import getUserId from './util/getUserId';
import paginator from './util/paginator';
import Files from './models/upload';
import CircularLetters from './models/circularLetter';
import ToCategoryType from './models/toCategoryType';
import validateFile from './util/validateFile';
import dynamicSort from './util/sorting';
import SubjectedToType from './models/subjectedToType';
import { isAuthenticated } from './util/isAuthenticated';
import { sendSMS } from './util/sendSMS';
import { handleUnderTen } from './util/handleUnderTen';
// import { sendRefreshToken } from './util/sendRefreshToken';
// import { createRefreshToken, createAccessToken } from './util/auth';

const uri = 'https://6317c2c5b5aa.ngrok.io/';
const imagePath = `${uri}images/`;
const thumbPath = `${uri}thumbnails/`;
String.prototype.allTrim = String.prototype.allTrim || function () {
    return this
        .replace(/ +/g, ' ')
        .replace(/\n\s*\n/g, '\n')
        .replace(/(\r\n|\n|\r)/gm, '') // Remove all 3 types of line breaks
        .replace(/^,+/, '')
        .replace(', ,', ',')
        .trim();
};

export const resolvers = {
    Query: {
        users: async (parent, { information, page, limit }, context, info) => {
            // getUserId(context.req);
            isAuthenticated(context.req);
            let users = [];
            if (context.session.userSearch
                && context.session.userPage == page
                && context.session.userLimit == limit) {
                users = context.session.userSearch;
            }
            else {
                users = await Users.find({
                    $or: [
                        { firstName: { $regex: `${information}` } },
                        { lastName: { $regex: `${information}` } },
                        { personelNumber: { $regex: `${information}` } },
                        { identificationNumber: { $regex: `${information}` } },
                        { phoneNumber: { $regex: `${information}` } },
                    ],
                    authorized: true
                });

                users.sort(dynamicSort('authorized', 'asc'));
                users.sort(dynamicSort('lastName', 'asc'));
                context.session.userSearch = users;
                context.session.userPage = page;
                context.session.userLimit = limit;
            }

            const pages = Math.ceil((users.length) / limit);
            users = paginator(users, page, limit).data;

            return {
                users,
                quantity: pages
            };
        },
        user: async (parent, args, context, info) => {
            const userId = isAuthenticated(context.req);
            return Users.findById(userId);
        },
        unauthenticatedUsers: (parent, args, context, info) => {
            isAuthenticated(context.req);
            return Users.find({ authorized: false });
        },
        files: () => {
            // getUserId(context.req);
            isAuthenticated(context.req);
            return Files.find();
        },
        circularLetters: async (parent, args, context, info) => {
            // getUserId(context.req);
            isAuthenticated(context.req);

            const options = {
                page: args.page,
                limit: args.limit
            };

            const circularLetters = await CircularLetters.paginate({}, options, (err, result) => {
                return result.docs;
            });

            circularLetters.forEach((circularLetter) => {
                const tempFiles = [];
                circularLetter.files.forEach((file) => {
                    tempFiles.push(`${imagePath}${file}`);
                });
                circularLetter.files = tempFiles;
            });

            return circularLetters;
        },
        circularLetterDetails: async (parent, args, context, info) => {
            // getUserId(context.req);
            isAuthenticated(context.req);

            const circularLetter = await CircularLetters.findById(args.id);
            if (!circularLetter) {
                throw new Error('Letter not found!');
            }

            let refrenceId = "";
            const referedTo = await CircularLetters.findOne({ number: circularLetter.referTo });
            if (referedTo) {
                refrenceId = referedTo.id;
            }

            const filesName = circularLetter.files;

            const tempFiles = [];
            circularLetter.files.forEach((file) => {
                tempFiles.push(`${imagePath}${file}`);
            });
            circularLetter.files = tempFiles;
            context.session.oldFile = circularLetter.files[0];

            return {
                circularLetter: circularLetter,
                refrenceId,
                filesName
            };
        },
        search: async (parent, { information, startDate, endDate, page, limit, sortBy, order }, context, info) => {
            // getUserId(context.req);
            isAuthenticated(context.req);

            let letters = [];
            if (context.session.searchResult && context.session.searchParam === information
                && context.session.searchSortBy === sortBy && context.session.searchOrder === order
                && context.session.startDate === startDate && context.session.endDate === endDate) {
                letters = context.session.searchResult;
            }
            else {
                const regExp = /(\d{2,4})\/(\d{1,2})\/(\d{1,2})/;
                const trimmed = information.allTrim();
                const paste = trimmed.split(" ");

                if (paste.length <= 1) {
                    const newLetter = await CircularLetters.find({
                        $or: [
                            { number: { $regex: `${information}` } },
                            { title: { $regex: `${information}` } },
                            { tags: { $regex: `${information}` } },
                            { from: { $regex: `${information}` } },
                            { referTo: { $regex: `${information}` } },
                            { importNumber: { $regex: `${information}` } },
                            { exportNumber: { $regex: `${information}` } },
                            { subjectedTo: { $regex: `${information}` } },
                            { toCategory: { $regex: `${information}` } },
                            { date: { $regex: `${information}` } }
                        ]
                    });

                    if (startDate && endDate) {
                        newLetter.forEach((letter) => {
                            if (parseInt(letter.date.replace(regExp, "$1$2$3")) >= parseInt(startDate.replace(regExp, "$1$2$3"))
                                && parseInt(endDate.replace(regExp, "$1$2$3")) >= parseInt(letter.date.replace(regExp, "$1$2$3"))) {
                                letters.push(letter);
                            }
                        });
                    }
                    else {
                        letters = newLetter;
                    }
                }
                else {
                    let lettersId = [];
                    for (let item of paste) {
                        const letter = await CircularLetters.find({
                            $or: [
                                { number: { $regex: `${item}` } },
                                { title: { $regex: `${item}` } },
                                { tags: { $regex: `${item}` } },
                                { from: { $regex: `${item}` } },
                                { referTo: { $regex: `${item}` } },
                                { importNumber: { $regex: `${item}` } },
                                { exportNumber: { $regex: `${item}` } },
                                { subjectedTo: { $regex: `${item}` } },
                                { toCategory: { $regex: `${item}` } },
                                { date: { $regex: `${item}` } }
                            ]
                        });
                        lettersId = [...lettersId, ...letter];
                    }

                    let lettersByWord = [...new Map(lettersId.map(obj => [`${obj._id}`, obj]))
                        .values()
                    ];

                    if (startDate && endDate) {
                        lettersByWord.forEach((letter) => {
                            if (parseInt(letter.date.replace(regExp, "$1$2$3")) >= parseInt(startDate.replace(regExp, "$1$2$3"))
                                && parseInt(endDate.replace(regExp, "$1$2$3")) >= parseInt(letter.date.replace(regExp, "$1$2$3"))) {
                                letters.push(letter);
                            }
                        });
                    }
                    else {
                        letters = lettersByWord;
                    }
                }

                letters.forEach((letter) => {
                    const tempFiles = [];
                    letter.files.forEach((file) => {
                        const index = file.lastIndexOf(".");
                        tempFiles.push(`${thumbPath}${file.substring(0, index)}-thumb${file.substring(index, file.length)}`);
                    });
                    letter.files = tempFiles;
                });

                letters.sort(dynamicSort(sortBy, order));
                context.session.searchResult = letters;
                context.session.searchParam = information;
                context.session.searchSortBy = sortBy;
                context.session.searchOrder = order;
                context.session.startDate = startDate;
                context.session.endDate = endDate;
            }

            const pages = Math.ceil((letters.length) / limit);

            letters = paginator(letters, page, limit).data;

            return {
                circularLetters: letters,
                quantity: pages
            }
        },
        appSearch: async (parent, { information, startDate, endDate, page, limit, sortBy, order }, context, info) => {
            // getUserId(context.req);
            isAuthenticated(context.req);

            let letters = [];
            if (context.session.searchResult && context.session.searchParam === information
                && context.session.searchSortBy === sortBy && context.session.searchOrder === order
                && context.session.startDate === startDate && context.session.endDate === endDate) {
                letters = context.session.searchResult;
            }
            else {
                const regExp = /(\d{2,4})\/(\d{1,2})\/(\d{1,2})/;
                const trimmed = information.allTrim();
                const paste = trimmed.split(" ");

                if (paste.length === 1) {
                    const newLetter = await CircularLetters.find({
                        $or: [
                            { number: { $regex: `${information}` } },
                            { title: { $regex: `${information}` } },
                            { tags: { $regex: `${information}` } },
                            { from: { $regex: `${information}` } },
                            { referTo: { $regex: `${information}` } },
                            { importNumber: { $regex: `${information}` } },
                            { exportNumber: { $regex: `${information}` } },
                            { subjectedTo: { $regex: `${information}` } },
                            { toCategory: { $regex: `${information}` } },
                            { date: { $regex: `${information}` } }
                        ]
                    });

                    if (startDate && endDate) {
                        newLetter.forEach((letter) => {
                            if (parseInt(letter.date.replace(regExp, "$1$2$3")) >= parseInt(startDate.replace(regExp, "$1$2$3"))
                                && parseInt(endDate.replace(regExp, "$1$2$3")) >= parseInt(letter.date.replace(regExp, "$1$2$3"))) {
                                letters.push(letter);
                            }
                        });
                    }
                    else if (startDate && !endDate) {
                        newLetter.forEach((letter) => {
                            if (parseInt(letter.date.replace(regExp, "$1$2$3")) >= parseInt(startDate.replace(regExp, "$1$2$3"))) {
                                letters.push(letter);
                            }
                        });
                    }
                    else if (!startDate && endDate) {
                        newLetter.forEach((letter) => {
                            if (parseInt(endDate.replace(regExp, "$1$2$3")) >= parseInt(letter.date.replace(regExp, "$1$2$3"))) {
                                letters.push(letter);
                            }
                        });
                    }
                    else {
                        letters = newLetter;
                    }

                    // if (!endDate) {
                    //     endDate = `${jMoment(nowDate).jYear()}/${handleUnderTen(jMoment(nowDate).jMonth() + 1)}/${handleUnderTen(jMoment(nowDate).jDate())}`;
                    // }

                    // if (startDate) {
                    //     newLetter.forEach((letter) => {
                    //         if (parseInt(letter.date.replace(regExp, "$1$2$3")) >= parseInt(startDate.replace(regExp, "$1$2$3"))
                    //             && parseInt(endDate.replace(regExp, "$1$2$3")) >= parseInt(letter.date.replace(regExp, "$1$2$3"))) {
                    //             letters.push(letter);
                    //         }
                    //     });
                    // }
                    // else {
                    //     letters = newLetter;
                    // }
                }
                else {
                    let lettersId = [];
                    for (let item of paste) {
                        const letter = await CircularLetters.find({
                            $or: [
                                { number: { $regex: `${item}` } },
                                { title: { $regex: `${item}` } },
                                { tags: { $regex: `${item}` } },
                                { from: { $regex: `${item}` } },
                                { referTo: { $regex: `${item}` } },
                                { importNumber: { $regex: `${item}` } },
                                { exportNumber: { $regex: `${item}` } },
                                { subjectedTo: { $regex: `${item}` } },
                                { toCategory: { $regex: `${item}` } },
                                { date: { $regex: `${item}` } }
                            ]
                        });
                        lettersId = [...lettersId, ...letter];
                    }

                    let lettersByWord = [...new Map(lettersId.map(obj => [`${obj._id}`, obj]))
                        .values()
                    ];

                    if (startDate && endDate) {
                        lettersByWord.forEach((letter) => {
                            if (parseInt(letter.date.replace(regExp, "$1$2$3")) >= parseInt(startDate.replace(regExp, "$1$2$3"))
                                && parseInt(endDate.replace(regExp, "$1$2$3")) >= parseInt(letter.date.replace(regExp, "$1$2$3"))) {
                                letters.push(letter);
                            }
                        });
                    }
                    else if (startDate && !endDate) {
                        lettersByWord.forEach((letter) => {
                            if (parseInt(letter.date.replace(regExp, "$1$2$3")) >= parseInt(startDate.replace(regExp, "$1$2$3"))) {
                                letters.push(letter);
                            }
                        });
                    }
                    else if (!startDate && endDate) {
                        lettersByWord.forEach((letter) => {
                            if (parseInt(endDate.replace(regExp, "$1$2$3")) >= parseInt(letter.date.replace(regExp, "$1$2$3"))) {
                                letters.push(letter);
                            }
                        });
                    }
                    else {
                        letters = lettersByWord;
                    }

                    // if (!endDate) {
                    //     endDate = `${jMoment(nowDate).jYear()}/${handleUnderTen(jMoment(nowDate).jMonth() + 1)}/${handleUnderTen(jMoment(nowDate).jDate())}`;
                    // }

                    // if (startDate) {
                    //     lettersByWord.forEach((letter) => {
                    //         if (parseInt(letter.date.replace(regExp, "$1$2$3")) >= parseInt(startDate.replace(regExp, "$1$2$3"))
                    //             && parseInt(endDate.replace(regExp, "$1$2$3")) >= parseInt(letter.date.replace(regExp, "$1$2$3"))) {
                    //             letters.push(letter);
                    //         }
                    //     });
                    // }
                    // else {
                    //     letters = lettersByWord;
                    // }
                }

                letters.forEach((letter) => {
                    const tempFiles = [];
                    letter.files.forEach((file) => {
                        const index = file.lastIndexOf(".");
                        tempFiles.push(`${thumbPath}${file.substring(0, index)}-thumb${file.substring(index, file.length)}`);
                    });
                    letter.files = tempFiles;
                });

                letters.sort(dynamicSort(sortBy, order));
                context.session.searchResult = letters;
                context.session.searchParam = information;
                context.session.searchSortBy = sortBy;
                context.session.searchOrder = order;
                context.session.startDate = startDate;
                context.session.endDate = endDate;
            }

            letters = paginator(letters, page, limit).data;

            return letters;
        },
        categoriesQuery: async (parent, args, context, info) => {
            // getUserId(context.req);
            const userId = isAuthenticated(context.req);
            const user = await Users.findById(userId);
            if (!user) {
                throw new Error("Authentication required!");
            }
            if (user.isAdmin === false) {
                throw new Error("Unauthorized action!")
            }

            const subjectedTo = await SubjectedToType.find();
            const toCategory = await ToCategoryType.find();
            return {
                subjectedTos: subjectedTo,
                toCategories: toCategory
            }
        },
        toCategories: async (parent, args, context, info) => {
            // getUserId(context.req);
            isAuthenticated(context.req);
            return ToCategoryType.find();
        },
        subjectedTos: async (parent, args, context, info) => {
            // getUserId(context.req);
            isAuthenticated(context.req);
            return SubjectedToType.find();
        }
    },
    Mutation: {
        adminSignUp: async (parent, args, context, info) => {
            isAuthenticated(context.req);
            const exist = await Users.findOne({ personelNumber: args.personelNumber });
            if (exist) {
                throw new Error("Duplicate personelNumber!");
            }
            const rndPassword = randomstring.generate(8);
            const password = await hashPassword(rndPassword);
            const user = new Users({
                ...args,
                _id: ObjectId().toString(),
                password,
                authorized: true,
                changedPassword: false
            });
            await user.save();
            sendSMS(user.id, user.phoneNumber);
            context.session.userSearch = null;
            return true;
        },
        userSignUp: async (parent, args, context, info) => {
            const exist = await Users.findOne({ personelNumber: args.personelNumber });
            if (exist) {
                throw new Error("Duplicate personelNumber!");
            }
            const rndPassword = randomstring.generate(8);
            const password = await hashPassword(rndPassword);
            const user = new Users({
                ...args,
                _id: ObjectId().toString(),
                password,
                authorized: false,
                changedPassword: false,
                isAdmin: false
            });
            await user.save();
            return true;
        },
        authenticateUser: async (parent, args, context, info) => {
            const user = await Users.findById(args.id);
            if (!user) {
                throw new Error("User not found!");
            }
            sendSMS(user.id, user.phoneNumber);
            return user;
        },
        deleteUser: async (parent, args, context, info) => {
            isAuthenticated(context.req);
            const user = await Users.findById(args.id);
            if (!user) {
                throw new Error("User not found!")
            }
            await user.deleteOne();
            context.session.userSearch = null;
            return user;
        },
        updateUser: async (parent, args, context, info) => {
            const userId = isAuthenticated(context.req);
            const user = await Users.findByIdAndUpdate(userId, args, { upsert: true, new: true });
            // const values = {};
            // Object.entries(args).forEach(([key, value]) => {
            //     if (value != null) {
            //         values[key] = value;
            //     }
            // });
            // const user = await Users.findByIdAndUpdate(userId, { $set: values }, { new: true }).exec()
            //     .catch((err) => {
            //         console.log(err)
            //     });
            return user;
        },
        login: async (parent, args, context, info) => {
            const user = await Users.findOne({
                personelNumber: args.data.personelNumber
            }, function (err, myUser) {
                console.log(err);
            });

            if (!user) {
                throw new Error("User not found!");
            }
            if (user.authorized === false) {
                throw new Error("Unauthorized user!")
            }

            const isMatch = await bcrypt.compare(decrypt(args.data.password), user.password);

            if (!isMatch) {
                throw new Error("Wrong password!");
            }

            // sendRefreshToken(context.res, user.id);

            const refreshToken = generateToken(user.id)
            context.res.cookie("jwt", refreshToken, { httpOnly: true });
            context.session.userID = user.id;
            console.log(`user ${user.id} logged in!`)
            // createAccessToken(user.id)

            return {
                user,
                token: generateToken(user.id)
            }
        },
        logout: async (parent, args, context, info) => {
            context.session.destroy();
            console.log(`user ${context.session.userID} logged out!`);
            context.res.clearCookie("jwt");
            context.res.clearCookie("qid");
            return true;
        },
        changePassword: async (parent, args, context, info) => {
            const userId = isAuthenticated(context.req);

            const user = await Users.findById(userId);

            const oldDecrypted = decrypt(args.data.oldPassword);

            const isMatch = await bcrypt.compare(oldDecrypted, user.password);

            if (!isMatch) {
                throw new Error("Wrong password!");
            }

            const newDecrypted = decrypt(args.data.newPassword);
            if (newDecrypted.length < 8) {
                throw new Error("Password must be more than 8 characters!");
            }
            user.password = await hashPassword(newDecrypted);
            user.changedPassword = true;
            await user.save();

            return true;
        },
        changePasswordOnApp: async (parent, args, context, info) => {
            const userId = isAuthenticated(context.req);
            const decrypted = decrypt(args.password);
            if (decrypted.length < 8) {
                throw new Error("Password must be more than 8 characters!");
            }

            const password = await hashPassword(decrypted);
            await Users.findByIdAndUpdate(userId, { password, changedPassword: true }, { upsert: true, new: true });
            return true;
        },
        forgotPassword: async (parent, { personelNumber }, context, info) => {
            const user = await Users.findOne({ personelNumber });
            if (!user) {
                throw new Error("User not found!");
            }
            if (!user.authorized) {
                throw new Error("User is not authorized!");
            }
            sendSMS(user.id, user.phoneNumber);
            return true;
        },
        uploadFile: async (parent, { file }, context, info) => {
            // getUserId(context.req);
            isAuthenticated(context.req);

            const { createReadStream, filename, mimetype, encoding } = await file;

            if (!validateFile(filename)) {
                throw new Error('Invalid file type!');
            }

            await new Promise(res =>
                createReadStream()
                    .pipe(createWriteStream(path.join(__dirname, "../images", filename)))
                    .on("close", res)
            );

            const newName = randomstring.generate(8) + filename;

            fs.rename(`./images/${filename}`, `./images/${newName}`, () => {
                console.log("Filename has been changed.")
            });

            const newFile = new Files({ filename: newName, mimetype, encoding });

            await newFile.save();
            return {
                filename: newName,
                filePath: `${imagePath}${newName}`
            };
        },
        deleteFile: async (parent, { filename }, context, info) => {
            // getUserId(context.req);
            isAuthenticated(context.req);

            await Files.deleteOne({ filename });
            fs.unlinkSync(`./images/${filename}`, (err) => {
                if (err) {
                    throw err;
                }
            });
            console.log(`File ${filename} has been removed!`);
            return true;
        },
        deleteFileWhileUpdate: async (parent, { id, filename }, context, info) => {
            const letter = await CircularLetters.findById(id);
            let oldFiles = letter.files;
            await Files.deleteOne({ filename });
            fs.unlinkSync(`./images/${filename}`, (err) => {
                if (err) {
                    throw err;
                }
            });
            console.log(`File ${filename} has been removed!`);
            let newFiles = [];
            for (let item of oldFiles) {
                if (item !== filename) {
                    newFiles.push(item);
                }
            }
            await CircularLetters.findByIdAndUpdate(id, { files: newFiles }, { upsert: true, new: true });
            return true;
        },
        deleteMultiFiles: async (parent, { filenames }, context, info) => {
            // getUserId(context.req);
            isAuthenticated(context.req);

            filenames.forEach(async (filename) => {
                await Files.deleteOne({ filename }, (err) => {
                    if (err) {
                        throw new Error("File not found!");
                    }
                });
                fs.unlinkSync(`./images/${filename}`, (err) => {
                    if (err) {
                        throw new Error("File not found!")
                    }
                    console.log(`File ${filename} has been removed!`);
                });
            });

            return true;
        },
        circularLetterInit: async (parent, args, context, info) => {
            // getUserId(context.req);
            const userId = isAuthenticated(context.req);
            const user = await Users.findById(userId);
            if (!user) {
                throw new Error("Authentication required!");
            }
            if (user.isAdmin === false) {
                throw new Error("Unauthorized action!")
            }

            // var i = 1;
            // setInterval(async () => {
            //     const circularLetter = new CircularLetters({
            //         _id: ObjectId().toString(),
            //         title: `بخشنامه${i}`,
            //         number: `۴۲۵/ص/۲۳${i}`,
            //         importNumber: `۲۱۳۴${i}`,
            //         date: '1385/05/22',
            //         dateOfCreation: moment().unix().toString(),
            //         from: `دانشگاه`,
            //         subjectedTo: 'همه',
            //         toCategory: 'همه',
            //         tags: [`کلاس${i}`, `سال${i}`],
            //         files: ['d5ESsyXZunnamed (5).jpg', 'DYSwHigkunnamed (7).jpg']
            //     });
            //     await circularLetter.save();
            //     i++;
            // }, 1000)

            // for (let i = 1; i <= 1000; i++) {
            //     const circularLetter = new CircularLetters({
            //         _id: ObjectId().toString(),
            //         title: `بخشنامه${i}`,
            //         number: `۴۲۵/ص/۲۳${i}`,
            //         importNumber: `۲۱۳۴${i}`,
            //         date: '1385/05/22',
            //         dateOfCreation: moment().unix().toString(),
            //         from: `دانشگاه`,
            //         subjectedTo: 'همه',
            //         toCategory: 'همه',
            //         tags: [`کلاس${i}`, `سال${i}`],
            //         files: ['8498498421.jpg', 'asfdewrf2566.jpg', 'dwdqa46w48d.jpg']
            //     });
            //     await circularLetter.save();
            // }
            const circularLetter = new CircularLetters({ ...args, _id: ObjectId().toString(), dateOfCreation: moment().unix().toString() });
            await circularLetter.save();
            const fileName = circularLetter.files[0];
            const index = fileName.lastIndexOf(".");
            Jimp.read(`./images/${fileName}`)
                .then(smallFile => {
                    return smallFile
                        .resize(192, 256)
                        .quality(72)
                        .write(`./thumbnails/${fileName.substring(0, index)}-thumb${fileName.substring(index, fileName.length)}`);
                })
                .catch(err => {
                    console.error(err);
                })
            context.session.searchResult = null;
            return true;
        },
        deleteCircularLetter: async (parent, args, context, info) => {
            // getUserId(context.req);
            isAuthenticated(context.req);

            const letter = await CircularLetters.findById(args.id);
            if (!letter) {
                throw new Error("Letter not found!");
            }

            letter.files.forEach(async (file) => {
                const index = fileName.lastIndexOf(".");
                await Files.deleteOne({ filename: file });
                fs.unlinkSync(`./images/${file}`);
            }, (err) => {
                console.error(err);
                fs.unlinkSync(`./thumbnails/${thumbPath}${file.substring(0, index)}-thumb${file.substring(index, file.length)}`);
            }, (err) => {
                console.error(err);
            });

            await letter.deleteOne();
            context.session.searchResult = null;
            return true;
        },
        updateCircularLetter: async (parent, args, context, info) => {
            // getUserId(context.req);
            isAuthenticated(context.req);

            const letter = await CircularLetters.findById(args.id);
            if (!letter) {
                throw new Error("Letter not found!");
            }

            if (args.data.number !== letter.number) {
                const newLetter = await CircularLetters.findOne({ number: args.data.number });
                if (newLetter) {
                    throw new Error("Number is taken!");
                }
            }
            else {
                delete args.data.number;
            }

            context.session.searchResult = null;


            await CircularLetters.findByIdAndUpdate(args.id, args.data, { upsert: true, new: true });

            if (context.session.oldFile && context.session.oldFile !== args.data.files[0]) {
                const fileName = context.session.oldFile[0];
                const index = fileName.lastIndexOf(".");
                fs.unlinkSync(`./thumbnails/${fileName.substring(0, index)}-thumb${fileName.substring(index, fileName.length)}`, (err) => {
                    if (err) {
                        throw err;
                    }
                });
                fileName = args.data.files[0];
                index = fileName.lastIndexOf(".");
                Jimp.read(`./images/${fileName}`)
                    .then(smallFile => {
                        return smallFile
                            .resize(192, 256)
                            .quality(72)
                            .write(`./thumbnails/${fileName.substring(0, index)}-thumb${fileName.substring(index, fileName.length)}`);
                    })
                    .catch(err => {
                        console.error(err);
                    })
            }

            // const values = {};
            // Object.entries(args.data).forEach(([key, value]) => {
            //     if (value != null) {
            //         values[key] = value;
            //     }
            // });
            // const newLetter = await CircularLetters.findByIdAndUpdate(args.id, { $set: values }, { new: true }).exec()
            //     .catch((err) => {
            //         console.log(err)
            //     });
            // await newLetter.save();
            context.session.searchResult = null;
            return true;
        },
        createToCategoryType: async (parent, args, context, info) => {
            // getUserId(context.req);
            isAuthenticated(context.req);

            const toCategoryType = new ToCategoryType(args);
            const duplicate = await ToCategoryType.findOne({ name: args.name });
            if (duplicate) {
                throw new Error("Duplicate name found!");
            }
            await toCategoryType.save();
            return toCategoryType;
        },
        deleteToCategoryType: async (parent, args, context, info) => {
            // getUserId(context.req);
            isAuthenticated(context.req);

            const toCategoryType = await ToCategoryType.findById(args.id);
            if (!toCategoryType) {
                throw new Error("Category not found!");
            }
            await toCategoryType.deleteOne();
            return toCategoryType;
        },
        createSubjectedToType: async (parent, args, context, info) => {
            // getUserId(context.req);
            isAuthenticated(context.req);

            const subjectedToType = new SubjectedToType(args);
            const duplicate = await SubjectedToType.findOne({ name: args.name });
            if (duplicate) {
                throw new Error("Duplicate name found!");
            }
            await subjectedToType.save();
            return subjectedToType;
        },
        deleteSubjectedToType: async (parent, args, context, info) => {
            // getUserId(context.req);
            isAuthenticated(context.req);

            const subjectedToType = await SubjectedToType.findById(args.id);
            if (!subjectedToType) {
                throw new Error("Category not found!");
            }
            await subjectedToType.deleteOne();
            return subjectedToType;
        },
        // revokeRefreshTokenForUser: async (parent, args, context, info) => {
        //     const user = await Users.findById(args.id);
        //     let userToken = user.tokenVersion + 1;
        //     user.tokenVersion = userToken;
        //     await user.save();
        //     return true
        // }
    }
};