import bcrypt, { hash } from 'bcryptjs';
import fs, { createReadStream, createWriteStream, unlink } from 'fs';
import path from 'path';
import randomstring from 'randomstring';
import { ObjectId } from 'mongodb';
import moment from 'moment';
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
import { sendRefreshToken } from './util/sendRefreshToken';
import { createRefreshToken, createAccessToken } from './util/auth';

const imagePath = 'https://20301271.ngrok.io/images/';
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
        users: (parent, args, context, info) => {
            // getUserId(context.req);
            isAuthenticated(context.req);
            return Users.find();
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
                && context.session.searchSortBy === sortBy && context.session.searchOrder === order) {
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
                        tempFiles.push(`${imagePath}${file}`);
                    });
                    letter.files = tempFiles;
                });

                letters.sort(dynamicSort(sortBy, order));
                context.session.searchResult = letters;
                context.session.searchParam = information;
                context.session.searchSortBy = sortBy;
                context.session.searchOrder = order;
            }

            const pages = Math.ceil((letters.length) / limit);

            letters = paginator(letters, page, limit).data;

            return {
                circularLetters: letters,
                quantity: pages
            }
        },
        categoriesQuery: async (parent, args, context, info) => {
            // getUserId(context.req);
            isAuthenticated(context.req);

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
        createUserAdmin: async (parent, args, context, info) => {
            isAuthenticated(context.req);
            const rndPassword = randomstring.generate(8);
            console.log(rndPassword);
            const password = await hashPassword(rndPassword);
            const user = new Users({
                ...args,
                password,
                authorized: true,
                changedPassword: true
            });
            await user.save();
            return user;
        },
        createUserApp: async (parent, args, context, info) => {
            const rndPassword = randomstring.generate(8);
            console.log(rndPassword);
            const password = await hashPassword(rndPassword);
            const user = new Users({
                ...args,
                password,
                authorized: false,
                changedPassword: false,
                isAdmin: false
            });
            await user.save();
            return user;
        },
        deleteUser: async (parent, args, context, info) => {
            isAuthenticated(context.req);
            const userId = context.req.userId.userId;
            const user = await Users.findById(userId);
            await user.deleteOne();
            return user;
        },
        updateUser: async (parent, args, context, info) => {
            isAuthenticated(context.req);
            const userId = context.req.userId.userId;
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

            const isMatch = await bcrypt.compare(args.data.password, user.password);

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
            // if (!context.req.userId) {
            // isAuthenticated(context.req);

            const userId = getUserId(context.req);
            const user = await Users.findById(userId);

            const isMatch = await bcrypt.compare(args.data.oldPassword, user.password);

            if (!isMatch) {
                throw new Error("Wrong password!");
            }

            user.password = await hashPassword(args.data.newPassword);
            await user.save();

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
            isAuthenticated(context.req);

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
            //         files: ['8498498421.jpg', 'asfdewrf2566.jpg', 'dwdqa46w48d.jpg']
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
                await Files.deleteOne({ filename: file });
                fs.unlinkSync(`./images/${file}`);
            }, (err) => {
                console.log(err);
            });

            await letter.deleteOne();
            return true;
        },
        updateCircularLetter: async (parent, args, context, info) => {
            // getUserId(context.req);
            isAuthenticated(context.req);

            const letter = await CircularLetters.findById(args.id);
            if (!letter) {
                throw new Error("Letter not found!");
            }

            if (args.data.number) {
                const letter = await CircularLetters.findOne({ number: args.data.number });
                if (letter) {
                    throw new Error("Number is taken!")
                }
            }

            await findByIdAndUpdate(args.id, args.data, { upsert: true, new: true });

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