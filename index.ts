

//var hash = require('pbkdf2-password')()



import express from 'express';


import session from 'express-session';
import mongoose from 'mongoose';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);


//const bcrypt = require('bcryptjs');

import dotenv from 'dotenv';
import connectDB from './config/dbconfig.js';

import path from 'path';



import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


import {logger} from './middleware/logEvents.js';


import errorHandler from './middleware/errorHandler.js';

import cors from "cors";

import emrouter from './routes/api/employees.js';

import usrouter from './routes/api/user.js';

import regrouter from "./routes/register.js";

import authrouter from "./routes/auth.js";

import refreshrouter from "./routes/refresh.js"

import corsOptions from './config/corsOptions.js';

import verifyJWT from "./middleware/verifyJWT.js";

import logrouter from "./routes/logout.js";


import credentials from "./middleware/credentials.js";


import cookieParser from "cookie-parser";


require("dotenv").config();



const app = express();

const port = 5000;






dotenv.config()


       //connect to mongodb
connectDB();




//custom middleware logger
app.use(logger);


// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement

app.use(credentials);


//Cors Origin Resource Sharing

app.use(cors(corsOptions));


// built in middlewarevto handle url encoded form data

app.use(express.urlencoded({ extended: false }));

// built in middleware to handle json data
app.use(express.json());


// middleware for json
app.use(cookieParser());


// serve static files
app.use('/', express.static(path.join(__dirname, "/public")));

//app.use('/subdir',  require(path.join(__dirname, 'routes', '/subdir.js')));




app.use("/register", regrouter);

app.use("/auth", authrouter);


app.use("/refresh", refreshrouter);

app.use("/logout", logrouter);


app.use(verifyJWT);


app.use('/employees', emrouter);

app.use('/user', usrouter);


app.use(session({

  resave: false,      // dont save session if unmodified
  saveUninitialized: false,   // dont create session until something stored
  secret: 'shhh, random secret key'

}));



//Property 'connect' does not exist on type
// 'new (options?: MongooseOptions | null | undefined) => typeof import("mongoose")'.ts(2339)





app.get('/', (req, res) => {

  res.send("hellosdfa0 world!!")
})


app.all('*', (req, res) => {                            

    res.status(404);
    if (req.accepts('html')){
         res.sendFile(path.join(__dirname, 'public/img', 'jinbe.png'));
    }


    else if (req.accepts('json')){
         res.json({ error: "404-king of piratez"})
    }

    else {
      res.type('txt').send("404 not found");
    }
});



app.use(errorHandler);




mongoose.connection.once('open', () => {


    console.log('Connected to MongoDB');
    app.listen(port, () => {
       console.log(`Example app listening on port ${port}`)
    });


});



