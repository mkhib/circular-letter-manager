import bcrypt from 'bcryptjs';
import fs, { createReadStream, createWriteStream, unlink } from 'fs';
import path from 'path';
import randomstring from 'randomstring';
import { ObjectId } from 'mongodb';
import moment from 'moment';
import Jimp from 'jimp';
import { decrypt } from './util/securePassword';
import Users from './models/user';
import { hashPassword } from './util/hashPassword';
import generateToken from './util/generateToken';
import paginator from './util/paginator';
import Files from './models/upload';
import CircularLetters from './models/circularLetter';
import ToCategoryType from './models/toCategoryType';
import validateFile from './util/validateFile';
import dynamicSort from './util/sorting';
import SubjectedToType from './models/subjectedToType';
import { isAuthenticated } from './util/isAuthenticated';
import { sendSMS } from './util/sendSMS';

const uri = 'http://localhost:3600/';
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
            isAuthenticated(context.req);

            let users = [];
            if (context.session.userSearch
                && context.session.userSearchParam === information
                && context.session.userPage === page
                && context.session.userLimit === limit) {
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

                users.sort(dynamicSort('lastName', 'asc'));
                context.session.userSearch = users;
                context.session.userSearchParam = information;
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
        unauthenticatedUsers: async (parent, { page, limit }, context, info) => {
            isAuthenticated(context.req);
            return Users.find({ authorized: false });
        },
        files: () => {
            isAuthenticated(context.req);
            return Files.find();
        },
        circularLetters: async (parent, args, context, info) => {
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

            return {
                circularLetter: circularLetter,
                refrenceId,
                filesName
            };
        },
        circularLetterDetailsEdit: async (parent, args, context, info) => {
            isAuthenticated(context.req);

            const circularLetter = await CircularLetters.findById(args.id);
            if (!circularLetter) {
                throw new Error('Letter not found!');
            }

            context.session.deletedFiles = null;
            context.session.oldFile = circularLetter.files[0];

            const filesName = circularLetter.files;

            const tempFiles = [];
            circularLetter.files.forEach((file) => {
                tempFiles.push(`${imagePath}${file}`);
            });
            circularLetter.files = tempFiles;

            return {
                circularLetter: circularLetter,
                filesName
            };
        },
        search: async (parent, { information, startDate, endDate, page, limit, sortBy, order }, context, info) => {
            isAuthenticated(context.req);

            if (information == '' && page == 1) {
                context.session.searchResult = null;
            }

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

                if (information == '') {
                    const newLetter = await CircularLetters.find();
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
                else if (paste.length <= 1) {
                    const newLetter = await CircularLetters.find({
                        // $or: [
                        //     { number: { $regex: `${information}` } },
                        //     { title: { $regex: `${information}` } },
                        //     { tags: { $regex: `${information}` } },
                        //     { from: { $regex: `${information}` } },
                        //     { referTo: { $regex: `${information}` } },
                        //     { importNumber: { $regex: `${information}` } },
                        //     { exportNumber: { $regex: `${information}` } },
                        //     { subjectedTo: { $regex: `${information}` } },
                        //     { toCategory: { $regex: `${information}` } },
                        //     { date: { $regex: `${information}` } }
                        // ]
                        searchingFields: { $regex: `${information}` }
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
                            // $or: [
                            //     { number: { $regex: `${item}` } },
                            //     { title: { $regex: `${item}` } },
                            //     { tags: { $regex: `${item}` } },
                            //     { from: { $regex: `${item}` } },
                            //     { referTo: { $regex: `${item}` } },
                            //     { importNumber: { $regex: `${item}` } },
                            //     { exportNumber: { $regex: `${item}` } },
                            //     { subjectedTo: { $regex: `${item}` } },
                            //     { toCategory: { $regex: `${item}` } },
                            //     { date: { $regex: `${item}` } }
                            // ]
                            searchingFields: { $regex: `${item}` }
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
            isAuthenticated(context.req);

            if (sortBy === '') {
                sortBy = 'dateOfCreation';
            }
            if (order === '') {
                order = 'desc';
            }

            if (information == '' && page == 1) {
                context.session.searchResult = null;
            }

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

                if (information == '') {
                    const newLetter = await CircularLetters.find();
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
                else if (paste.length === 1) {
                    const newLetter = await CircularLetters.find({
                        // $or: [
                        //     { number: { $regex: `${information}` } },
                        //     { title: { $regex: `${information}` } },
                        //     { tags: { $regex: `${information}` } },
                        //     { from: { $regex: `${information}` } },
                        //     { referTo: { $regex: `${information}` } },
                        //     { importNumber: { $regex: `${information}` } },
                        //     { exportNumber: { $regex: `${information}` } },
                        //     { subjectedTo: { $regex: `${information}` } },
                        //     { toCategory: { $regex: `${information}` } },
                        //     { date: { $regex: `${information}` } }
                        // ]
                        searchingFields: { $regex: `${information}` }
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
                }
                else {
                    let lettersId = [];
                    for (let item of paste) {
                        const letter = await CircularLetters.find({
                            // $or: [
                            //     { number: { $regex: `${item}` } },
                            //     { title: { $regex: `${item}` } },
                            //     { tags: { $regex: `${item}` } },
                            //     { from: { $regex: `${item}` } },
                            //     { referTo: { $regex: `${item}` } },
                            //     { importNumber: { $regex: `${item}` } },
                            //     { exportNumber: { $regex: `${item}` } },
                            //     { subjectedTo: { $regex: `${item}` } },
                            //     { toCategory: { $regex: `${item}` } },
                            //     { date: { $regex: `${item}` } }
                            // ]
                            searchingFields: { $regex: `${item}` }
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
            isAuthenticated(context.req);
            return ToCategoryType.find();
        },
        subjectedTos: async (parent, args, context, info) => {
            isAuthenticated(context.req);
            return SubjectedToType.find();
        },
        appDetails: async (parent, args, context, info) => {
            return {
                version: '1.1.0',
                link: 'https://bakhshnameyab.ir/downloads/CircularLetterSearch-1.1.0.apk'
            }
        },
        numberOfUnauthorized: async (parent, args, contex, info) => {
            const users = await Users.find({ authorized: false });
            return users.length;
        }
    },
    Mutation: {
        adminSignUp: async (parent, args, context, info) => {
            isAuthenticated(context.req);
            const dupPersonel = await Users.findOne({ personelNumber: args.personelNumber });
            const dupId = await Users.findOne({ identificationNumber: args.identificationNumber });
            if (dupPersonel) {
                throw new Error("Duplicate personelNumber!");
            }
            if (dupId) {
                throw new Error("Duplicate IdentificationNumber!");
            }
            const rndPassword = randomstring.generate(8);
            const password = await hashPassword(rndPassword);
            const user = new Users({
                ...args,
                _id: ObjectId().toString(),
                password,
                authorized: true,
                changedPassword: false,
                timeLimit: moment().unix().toString()
            });
            await user.save();
            sendSMS(user.id, user.phoneNumber);
            context.session.userSearch = null;
            return true;
        },
        userSignUp: async (parent, args, context, info) => {
            const dupPersonel = await Users.findOne({ personelNumber: args.personelNumber });
            const dupId = await Users.findOne({ identificationNumber: args.identificationNumber });
            if (dupPersonel) {
                throw new Error("Duplicate personelNumber!");
            }
            if (dupId) {
                throw new Error("Duplicate IdentificationNumber!");
            }
            const rndPassword = randomstring.generate(8);
            const password = await hashPassword(rndPassword);
            const user = new Users({
                ...args,
                _id: ObjectId().toString(),
                password,
                authorized: false,
                changedPassword: false,
                isAdmin: false,
                timeLimit: moment().unix().toString()
            });
            await user.save();
            context.session.newUsers = null;
            return true;
        },
        authenticateUser: async (parent, args, context, info) => {
            const user = await Users.findById(args.id);
            if (!user) {
                throw new Error("User not found!");
            }
            sendSMS(user.id, user.phoneNumber);
            context.session.newUsers = null;
            return user;
        },
        deleteUser: async (parent, args, context, info) => {
            const userId = isAuthenticated(context.req);
            const user = await Users.findById(args.id);
            if (!user) {
                throw new Error("User not found!")
            }
            if (args.id === userId) {
                throw new Error("Unauthorized action!!!");
            }
            await user.deleteOne();
            context.session.userSearch = null;
            context.session.newUsers = null;
            return user;
        },
        updateUser: async (parent, args, context, info) => {
            const userId = isAuthenticated(context.req);
            const user = await Users.findByIdAndUpdate(userId, args, { upsert: true, new: true });
            return user;
        },
        login: async (parent, args, context, info) => {
            const user = await Users.findOne({
                personelNumber: args.data.personelNumber
            }, function (err, myUser) {
                console.error(err);
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

            const refreshToken = generateToken(user.id)
            context.res.cookie("prpss", refreshToken, { httpOnly: true });
            context.session.userID = user.id;
            console.log(`user ${user.id} logged in!`);

            return {
                user,
                token: generateToken(user.id)
            }
        },
        logout: async (parent, args, context, info) => {
            context.session.destroy();
            console.log(`user ${context.session.userID} logged out!`);
            context.res.clearCookie("prpss");
            context.res.clearCookie("GraphSeSSID");
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
            const user = await Users.findById(userId);
            if (user.changedPassword) {
                throw new Error("Unauthorized access!!!");
            }
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
            if (parseInt(moment().unix().toString(), 10) < (parseInt(user.timeLimit, 10) + 60)) {
                throw new Error("Wait 1 minute!");
            }
            sendSMS(user.id, user.phoneNumber);
            return true;
        },
        uploadFile: async (parent, { file }, context, info) => {
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
            isAuthenticated(context.req);

            if (context.session.deletedFiles === null) {
                context.session.deletedFiles = [filename];
            }
            else {
                const deletedFiles = context.session.deletedFiles;
                deletedFiles.push(filename);
                context.session.deletedFiles = deletedFiles;
            }
            // const letter = await CircularLetters.findById(id);
            // let oldFiles = letter.files;
            // await Files.deleteOne({ filename });
            // fs.unlinkSync(`./images/${filename}`, (err) => {
            //     if (err) {
            //         throw err;
            //     }
            // });
            // console.log(`File ${filename} has been removed!`);
            // let newFiles = [];
            // for (let item of oldFiles) {
            //     if (item !== filename) {
            //         newFiles.push(item);
            //     }
            // }
            // await CircularLetters.findByIdAndUpdate(id, { files: newFiles }, { upsert: true, new: true });
            return true;
        },
        deleteMultiFiles: async (parent, { filenames }, context, info) => {
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
            const userId = isAuthenticated(context.req);
            const user = await Users.findById(userId);
            if (!user) {
                throw new Error("Authentication required!");
            }
            if (user.isAdmin === false) {
                throw new Error("Unauthorized action!")
            }

            /*for (let i = 0; i < 10000; i++) {
                const title = `بخشنامه${i}`;
                const number = `۳۴/۱۲۳۴${i}`;
                const importNumber = `۲۱۳۴${i}`;
                const date = '1385/05/22';
                const dateOfCreation = 1590950646 + i;
                const from = `دانشگاه`;
                const subjectedTo = 'همه';
                const toCategory = 'همه';
                const tags = [`کلاس${i}`, `سال${i}`];
                const files = ['MDFnUeNCYmayqrOp8044284_232.jpg'];
                const circularLetter = new CircularLetters({
                    _id: ObjectId().toString(),
                    title,
                    number,
                    importNumber,
                    date,
                    dateOfCreation: `${dateOfCreation}`,
                    from,
                    subjectedTo,
                    toCategory,
                    tags,
                    files,
                    searchingFields: `${title} ${number} ${importNumber} ${date} ${from} ${subjectedTo} ${toCategory} ${tags}`
                });
                await circularLetter.save();
            }*/

            const circularLetter = new CircularLetters({ ...args, _id: ObjectId().toString(), dateOfCreation: moment().unix().toString(), searchingFields: `${args.title} ${args.number} ${args.importNumber} ${args.exportNumber} ${args.date} ${args.from} ${args.subjectedTo} ${args.toCategory} ${args.tags}` });
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
                });
            context.session.searchResult = null;
            return true;
        },
        deleteCircularLetter: async (parent, args, context, info) => {
            isAuthenticated(context.req);

            const letter = await CircularLetters.findById(args.id);
            if (!letter) {
                throw new Error("Letter not found!");
            }

            letter.files.forEach(async (file) => {
                await Files.deleteOne({ filename: file });
                fs.unlinkSync(`./images/${file}`);
            }, (err) => {
                console.error(err);
            });
            const fileName = letter.files[0];
            const index = fileName.lastIndexOf(".");
            fs.unlinkSync(`./thumbnails/${fileName.substring(0, index)}-thumb${fileName.substring(index, fileName.length)}`, (err) => {
                if (err) {
                    throw err;
                }
            });

            await letter.deleteOne();
            context.session.searchResult = null;
            return true;
        },
        updateCircularLetter: async (parent, args, context, info) => {
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

            await CircularLetters.findByIdAndUpdate(args.id, { ...args.data, searchingFields: `${args.data.title} ${args.data.number} ${args.data.importNumber} ${args.data.exportNumber} ${args.data.date} ${args.data.from} ${args.data.subjectedTo} ${args.data.toCategory} ${args.data.tags}` }, { upsert: true, new: true });

            if (context.session.deletedFiles) {
                const filenames = context.session.deletedFiles;
                filenames.forEach(async (filename) => {
                    await Files.deleteOne({ filename }, (err) => {
                        if (err) {
                            throw new Error("File not found!");
                        }
                    });
                    fs.unlinkSync(`./images/${filename}`, (err) => {
                        if (err) {
                            throw new Error("File not found!");
                        }
                        console.log(`File ${filename} has been removed!`);
                    });
                });
            }

            if (context.session.oldFile !== args.data.files[0]) {
                let fileName = context.session.oldFile;
                let index = fileName.lastIndexOf(".");
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
            context.session.searchResult = null;
            return true;
        },
        createToCategoryType: async (parent, args, context, info) => {
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
            isAuthenticated(context.req);

            const toCategoryType = await ToCategoryType.findById(args.id);
            if (!toCategoryType) {
                throw new Error("Category not found!");
            }
            await toCategoryType.deleteOne();
            return toCategoryType;
        },
        createSubjectedToType: async (parent, args, context, info) => {
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
            isAuthenticated(context.req);

            const subjectedToType = await SubjectedToType.findById(args.id);
            if (!subjectedToType) {
                throw new Error("Category not found!");
            }
            await subjectedToType.deleteOne();
            return subjectedToType;
        }
    }
};