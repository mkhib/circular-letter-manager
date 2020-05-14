import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    
    type Query {
        users: [User!]!
        files: [String]
        circularLetters(page: Int, limit: Int): [CircularLetter!]!
        circularLetterDetails(id: ID!): CircularLetterDetail!
        search(information: String, startDate: String,
         endDate: String, page: Int, limit: Int, sortBy: String, order: String): SearchOutput!
        categoriesQuery: CategoriesResult!
        toCategories: [ToCategoryType!]!
        subjectedTos: [SubjectedToType!]!
    }

    type Mutation {
        createUser(firstName: String!, lastName: String!,
         personelNumber: Int!, identificationNumber: Int!): UserOutput!
        login(data: LoginUserInput): AuthPayLoad!
        logout: Boolean!
        deleteUser: UserOutput!
        updateUser(name: String, email: String, password: String): UserOutput!
        changePassword(data: passwordInput!): Boolean!
        uploadFile(file: Upload!): ReturnFile!
        deleteFile(filename: String!): Boolean!
        deleteMultiFiles(filenames: [String]!): Boolean!
        circularLetterInit(title: String!, number: String!, importNumber: String,
         exportNumber: String, referTo: String, date: String!, from: String!,
         subjectedTo: String!, toCategory: String!, tags: [String]!, files: [String]! ): Boolean!
        deleteCircularLetter(id: ID!): Boolean!
        updateCircularLetter(id: ID!, data: updateCircularletter): Boolean!
        createToCategoryType(name: String!): ToCategoryType!
        deleteToCategoryType(id: ID!): ToCategoryType!
        createSubjectedToType(name: String!): SubjectedToType!
        deleteSubjectedToType(id: ID!): SubjectedToType!
    }

    type User {
        id: ID!
        firstName: String!
        lastName: String!
        password: String!
        personelNumber: Int!
        identificationNumber: Int!
        authorized: Boolean!
        changedPassword: Boolean!
    }
    
    type AuthPayLoad {
        user: User!
        token: String!
    }

    type Response {
        condition: Boolean!
        filename: String!
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
    }

    type UserOutput {
        id: ID!
        firstName: String!
        lastName: String!
        personelNumber: Int!
        identificationNumber: Int!
        authorized: Boolean!
        changedPassword: Boolean!
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
    }

    input LoginUserInput {
        personelNumber: Int!
        password: String!
    }

    input passwordInput {
        oldPassword: String!
        newPassword: String!
    }

    input updateCircularletter {
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
    }
`