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

const imagePath = 'http://localhost:3600/images/';
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
            // if (!context.req.userId) {
            //     throw new Error("JWT EXPIRED")
            // }
            return Users.find();
        },
        files: () => {
            // getUserId(context.req);
            // if (!context.req.userId) {
            //     throw new Error("JWT EXPIRED")
            // }
            return Files.find();
        },
        circularLetters: async (parent, args, context, info) => {
            // getUserId(context.req);
            // if (!context.req.userId) {
            //     throw new Error("JWT EXPIRED")
            // }

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
            // if (!context.req.userId) {
            //     throw new Error("JWT EXPIRED")
            // }

            const circularLetter = await CircularLetters.findById(args.id);
            if (!circularLetter) {
                throw new Error('Letter not found');
            }

            let refrenceId = "";
            const referedTo = await CircularLetters.findOne({ number: circularLetter.referTo });
            if (referedTo) {
                refrenceId = referedTo.id;
            }

            const tempFiles = [];
            circularLetter.files.forEach((file) => {
                tempFiles.push(`${imagePath}${file}`);
            });
            circularLetter.files = tempFiles;

            return {
                circularLetter: circularLetter,
                refrenceId
            };
        },
        search: async (parent, { information, startDate, endDate, page, limit, sortBy, order }, context, info) => {
            // getUserId(context.req);
            // if (!context.req.userId) {
            //     throw new Error("JWT EXPIRED")
            // }

            let letters = [];
            if (context.session.searchResult && context.session.searchParam === information) {
                letters = context.session.searchResult;
                console.log("Session")
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

                context.session.searchResult = null;
                context.session.searchResult = letters;
                context.session.searchParam = information;
            }

            const pages = Math.ceil((letters.length) / limit);

            letters.sort(dynamicSort(sortBy, order));
            letters = paginator(letters, page, limit).data;

            return {
                circularLetters: letters,
                quantity: pages
            }
        },
        categoriesQuery: async (parent, args, context, info) => {
            // getUserId(context.req);
            // if (!context.req.userId) {
            //     throw new Error("JWT EXPIRED")
            // }

            const subjectedTo = await SubjectedToType.find();
            const toCategory = await ToCategoryType.find();
            return {
                subjectedTos: subjectedTo,
                toCategories: toCategory
            }
        },
        toCategories: async (parent, args, context, info) => {
            // getUserId(context.req);
            // if (!context.req.userId) {
            //     throw new Error("JWT EXPIRED")
            // }
            return ToCategoryType.find();
        },
        subjectedTos: async (parent, args, context, info) => {
            // getUserId(context.req);
            // if (!context.req.userId) {
            //     throw new Error("JWT EXPIRED")
            // }
            return SubjectedToType.find();
        }
    },
    Mutation: {
        createUser: async (parent, args, context, info) => {
            const rndPassword = randomstring.generate(8);
            console.log(rndPassword);
            const password = await hashPassword(rndPassword);
            const user = new Users({
                ...args,
                password,
                authorized: false,
                changedPassword: false
            });
            await user.save();
            return user;
        },
        deleteUser: async (parent, args, context, info) => {
            // if (!context.req.userId) {
            //     throw new Error("JWT EXPIRED")
            // }
            const userId = context.req.userId;
            const user = await Users.findById(userId);
            await user.deleteOne();
            return user;
        },
        updateUser: async (parent, args, context, info) => {
            // if (!context.req.userId) {
            //     throw new Error("JWT EXPIRED")
            // }
            const userId = context.req.userId;
            if (typeof args.password === 'string') {
                args.password = await hashPassword(args.password)
            }
            const values = {};
            Object.entries(args).forEach(([key, value]) => {
                if (value != null) {
                    values[key] = value;
                }
            });
            const user = await Users.findByIdAndUpdate(userId, { $set: values }, { new: true }).exec()
                .catch((err) => {
                    console.log(err)
                });
            return user;
        },
        login: async (parent, args, context, info) => {
            const user = await Users.findOne({
                personelNumber: args.data.personelNumber
            }, function (err, myUser) {
                console.log(err);
            });

            if (!user) {
                throw new Error("User not found");
            }

            const isMatch = await bcrypt.compare(args.data.password, user.password);

            if (!isMatch) {
                throw new Error("Wrong password");
            }

            const refreshToken = generateToken(user.id)
            context.res.cookie("jwt", refreshToken);
            context.session.searchResult = null;

            return {
                user,
                token: generateToken(user.id)
            }
        },
        logout: async (parent, args, context, info) => {
            context.session.destroy();
            context.res.clearCookie();
            console.log(`user ${context.req.userId.userId} logged out`);
            return true;
        },
        changePassword: async (parent, args, context, info) => {
            // if (!context.req.userId) {
            //     throw new Error("JWT EXPIRED")
            // }
            const userId = context.req.userId;
            const user = await Users.findById(userId);

            const isMatch = await bcrypt.compare(args.data.oldPassword, user.password);

            if (!isMatch) {
                throw new Error("Old password is wrong");
            }

            user.password = await hashPassword(args.data.newPassword);
            await user.save();

            return user;
        },
        uploadFile: async (parent, { file }, context, info) => {
            // getUserId(context.req);
            // if (!context.req.userId) {
            //     throw new Error("JWT EXPIRED")
            // }

            const { createReadStream, filename, mimetype, encoding } = await file;

            if (!validateFile(filename)) {
                throw new Error('Invalid file type');
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
            // if (!context.req.userId) {
            //     throw new Error("JWT EXPIRED")
            // }

            await Files.deleteOne({ filename });
            fs.unlinkSync(`./images/${filename}`, (err) => {
                if (err) {
                    throw err;
                }
            });
            console.log(`File ${filename} has been removed`);
            return true;
        },
        deleteMultiFiles: async (parent, { filenames }, context, info) => {
            // getUserId(context.req);
            // if (!context.req.userId) {
            //     throw new Error("JWT EXPIRED")
            // }

            filenames.forEach(async (filename) => {
                await Files.deleteOne({ filename }, (err) => {
                    if (err) {
                        throw new Error("File not found");
                    }
                });
                fs.unlinkSync(`./images/${filename}`, (err) => {
                    if (err) {
                        throw new Error("File not found")
                    }
                    console.log(`File ${filename} has been removed`);
                });
            });

            return true;
        },
        circularLetterInit: async (parent, args, context, info) => {
            // getUserId(context.req);
            // if (!context.req.userId) {
            //     throw new Error("JWT EXPIRED")
            // }

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
            // if (!context.req.userId) {
            //     throw new Error("JWT EXPIRED")
            // }

            const letter = await CircularLetters.findById(args.id);
            if (!letter) {
                throw new Error("Letter not found");
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
            // if (!context.req.userId) {
            //     throw new Error("JWT EXPIRED")
            // }

            const letter = await CircularLetters.findById(args.id);
            if (!letter) {
                throw new Error("Letter not found");
            }

            const values = {};
            Object.entries(args.data).forEach(([key, value]) => {
                if (value != null) {
                    values[key] = value;
                }
            });
            const newLetter = await CircularLetters.findByIdAndUpdate(args.id, { $set: values }, { new: true }).exec()
                .catch((err) => {
                    console.log(err)
                });
            await newLetter.save();
            return true;
        },
        createToCategoryType: async (parent, args, context, info) => {
            // getUserId(context.req);
            // if (!context.req.userId) {
            //     throw new Error("JWT EXPIRED")
            // }

            const toCategoryType = new ToCategoryType(args);
            const duplicate = await ToCategoryType.findOne({ name: args.name });
            if (duplicate) {
                throw new Error("Duplicate name found");
            }
            await toCategoryType.save();
            return toCategoryType;
        },
        deleteToCategoryType: async (parent, args, context, info) => {
            // getUserId(context.req);
            // if (!context.req.userId) {
            //     throw new Error("JWT EXPIRED")
            // }

            const toCategoryType = await ToCategoryType.findById(args.id);
            if (!toCategoryType) {
                throw new Error("Category not found");
            }
            await toCategoryType.deleteOne();
            return toCategoryType;
        },
        createSubjectedToType: async (parent, args, context, info) => {
            // getUserId(context.req);
            // if (!context.req.userId) {
            //     throw new Error("JWT EXPIRED")
            // }

            const subjectedToType = new SubjectedToType(args);
            const duplicate = await SubjectedToType.findOne({ name: args.name });
            if (duplicate) {
                throw new Error("Duplicate name found");
            }
            await subjectedToType.save();
            return subjectedToType;
        },
        deleteSubjectedToType: async (parent, args, context, info) => {
            // getUserId(context.req);
            // if (!context.req.userId) {
            //     throw new Error("JWT EXPIRED")
            // }

            const subjectedToType = await SubjectedToType.findById(args.id);
            if (!subjectedToType) {
                throw new Error("Category not found");
            }
            await subjectedToType.deleteOne();
            return subjectedToType;
        }
    }
};