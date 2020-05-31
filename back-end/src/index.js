import '@babel/polyfill/noConflict';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import moesif from 'moesif-express';
import mongoose from 'mongoose';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import session from 'express-session';
import mongoconnect from 'connect-mongo';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { verify } from 'jsonwebtoken';
import uuid from 'uuid';
import helmet from 'helmet';
import RateLimit from 'express-rate-limit';
import MongoDBStore from 'rate-limit-mongo';
import morgan from 'morgan';
import fs from 'fs';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';

const MongoStore = mongoconnect(session);

const JWT_TOKEN_SECRET = "pwtfkipoewofkipejgfpewdjfpdoewfpokwxcvdjvkdsjf";

const app = express();

const endpoint = `http://localhost:3600/graphql`;

let dbUrl = 'mongodb://localhost:27017/test';
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, "DB connection error"));
mongoose.set('useCreateIndex', true);

const SERVER = new ApolloServer({
    typeDefs,
    resolvers,
    engine: {
        debugPrintReports: true
    },
    playground: {
        endpoint,
        settings: {
            'editor.theme': 'dark'
        }
    },
    context: ({ req, res }) =>
        ({
            req,
            res,
            session: req.session
        })
});

/*let moesifMiddleware = moesif({
    applicationId: 'eyJhcHAiOiIzNDU6NjUzIiwidmVyIjoiMi4wIiwib3JnIjoiODc6MjM0IiwiaWF0IjoxNTkwNTM3NjAwfQ.LJfUFN2RtgjCMcnznKf6Mn6dep0JNq3yMZj-l_WOm7M',

    // Set to false if you don't want to capture req/resp body
    logBody: true,

    // Optional hook to link API calls to users
    identifyUser: function (req, res) {
        return req.user ? req.user.id : undefined;
    },
});*/

let acessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(morgan('combined', { stream: acessLogStream }));

existsSync(path.join(__dirname, "../images")) || mkdirSync(path.join(__dirname, "../images"));
existsSync(path.join(__dirname, "../thumbnails")) || mkdirSync(path.join(__dirname, "../thumbnails"));

const limiter = new RateLimit({
    store: new MongoDBStore({
        uri: dbUrl
    }),
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
    message: "Too many requests"
});

app.use(limiter);

app.use("/images", express.static(path.join(__dirname, "../images")));
app.use("/thumbnails", express.static(path.join(__dirname, "../thumbnails")));

app.use(cors({
    credentials: true,
    origin: true
}));

/*app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});*/

app.use(cookieParser());
app.use(helmet());
app.use(helmet.frameguard({ action: 'SAMEORIGIN' }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('trust proxy', 1);

app.use(
    session({
        store: new MongoStore({
            mongooseConnection: mongoose.connection
        }),
        genid: uuid,
        secret: "dwpoqreKPO@KWEPD24ePOWRFKI0i90w*W^$%xklczm",
        name: 'GraphSeSSID',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 7200000,
            httpOnly: true,
            // sameSite: true,
            secure: process.env.NODE_ENV === "production"
        }
    })
);

// app.use(moesifMiddleware);

app.use((req, res, next) => {
    const token = req.cookies["prpss"];
    try {
        const userId = verify(token, JWT_TOKEN_SECRET)
        req.userId = userId;
    }
    catch{ }
    next();
});

/*app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
});*/

SERVER.applyMiddleware({
    app,
    cors: false
});

const PORT = process.env.PORT || 3600;

app.listen(PORT, () => {
    console.log(`Server ready at port ${endpoint}`);
});