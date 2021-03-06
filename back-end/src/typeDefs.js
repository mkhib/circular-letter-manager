import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    
    type Query {
        users(information: String, page: Int, limit: Int): UserSearch!
        user: UserOutput!
        unauthenticatedUsers: [UserOutput]!
        files: [String]
        circularLetters(page: Int, limit: Int): [CircularLetter!]!
        circularLetterDetails(id: ID!): CircularLetterDetail!
        circularLetterDetailsEdit(id: ID!): CircularLetterDetail!
        search(information: String, startDate: String,
         endDate: String, page: Int, limit: Int, sortBy: String, order: String): SearchOutput!
        appSearch(information: String, startDate: String,
         endDate: String, page: Int, limit: Int, sortBy: String, order: String): [CircularLetter!]!
        categoriesQuery: CategoriesResult!
        toCategories: [ToCategoryType!]!
        subjectedTos: [SubjectedToType!]!
        appDetails: AppOutput!
        numberOfUnauthorized: Int!
    }

    type Mutation {
        adminSignUp(firstName: String!, lastName: String!,
         personelNumber: String!, identificationNumber: String!, phoneNumber: String!, isAdmin: Boolean!): Boolean!
        userSignUp(firstName: String!, lastName: String!,
         personelNumber: String!, identificationNumber: String!, phoneNumber: String!): Boolean!
        authenticateUser(id: ID!): UserOutput!
        login(data: LoginUserInput): AuthPayLoad!
        logout: Boolean!
        deleteUser(id: ID!): UserOutput!
        updateUser(firstName: String, lastName: String): UserOutput!
        changePassword(data: PasswordInput!): Boolean!
        changePasswordOnApp(password: String!):Boolean!
        forgotPassword(personelNumber: String!): Boolean!
        uploadFile(file: Upload!): ReturnFile!
        deleteFile(filename: String!): Boolean!
        deleteFileWhileUpdate(id: ID! ,filename: String!): Boolean!
        deleteMultiFiles(filenames: [String]!): Boolean!
        circularLetterInit(title: String!, number: String!, importNumber: String,
         exportNumber: String, referTo: String, date: String!, from: String!,
         subjectedTo: String!, toCategory: String!, tags: [String]!, files: [String]! ): Boolean!
        deleteCircularLetter(id: ID!): Boolean!
        updateCircularLetter(id: ID!, data: updateCircularLetter): Boolean!
        createToCategoryType(name: String!): ToCategoryType!
        deleteToCategoryType(id: ID!): ToCategoryType!
        createSubjectedToType(name: String!): SubjectedToType!
        deleteSubjectedToType(id: ID!): SubjectedToType!
    }

    type User {
        _id: String!
        firstName: String!
        lastName: String!
        password: String!
        personelNumber: String!
        identificationNumber: String!
        phoneNumber: String!
        authorized: Boolean!
        changedPassword: Boolean!
        isAdmin: Boolean!
        timeLimit: String!
    }
    
    type AuthPayLoad {
        user: UserOutput!
        token: String!
    }

    type File {
        id: ID!
        filename: String!
        mimetype: String!
        encoding: String!
    }

    type ReturnFile {
        filename: String!
        filePath: String!
    }

    type CircularLetter {
        _id: String!
        title: String!
        number: String!
        importNumber: String
        exportNumber: String
        referTo: String
        date: String!
        dateOfCreation: String!
        from: String!
        subjectedTo: String!
        toCategory: String!
        tags: [String!]!
        files: [String]!
        searchingFields: String!
    }

    type UserOutput {
        _id: String!
        firstName: String!
        lastName: String!
        personelNumber: String!
        identificationNumber: String!
        phoneNumber: String!
        authorized: Boolean!
        changedPassword: Boolean!
        isAdmin: Boolean!
    }

    type SearchOutput {
        circularLetters: [CircularLetter]
        quantity: Int
    }

    type ToCategoryType {
        id: ID!
        name: String!
    }

    type SubjectedToType {
        id: ID!
        name: String!
    }

    type CategoriesResult {
        subjectedTos: [SubjectedToType]
        toCategories: [ToCategoryType]
    }

    type CircularLetterDetail {
        circularLetter: CircularLetter!
        refrenceId: String
        filesName: [String]
    }

    type UserSearch {
        users: [UserOutput!]!
        quantity: Int
    }

    type AppOutput {
        version: Int!
        versionToShow: String!
        link: String!
    }

    input LoginUserInput {
        personelNumber: String!
        password: String!
    }

    input PasswordInput {
        oldPassword: String!
        newPassword: String!
    }

    input updateCircularLetter {
        title: String
        number: String
        importNumber: String
        exportNumber: String
        referTo: String
        date: String
        from: String
        subjectedTo: String
        toCategory: String
        tags: [String]
        files: [String]
    }
`