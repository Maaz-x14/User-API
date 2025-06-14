const express = require('express');
const fs = require('fs');


const { connectMongoDB } = require('./connection');
const {logReqRes, static} = require('./Middlewares/index')

// Routes
const userRouter = require('./routes/users')

// let users = require('./MOCK_DATA.json');
const { timeStamp } = require('console');
const { dirname } = require('path');

// Initialize app
const app = express();
const port = 3000;

// Connection
connectMongoDB('mongodb://127.0.0.1:27017/myDB')

// Middlewares
app.use(static("public"));

// Middleware 0
app.use(express.urlencoded({extended: false}));
// Returns middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option

// Middleware 1
app.use(express.json());
// Returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option.

// It processes the body of request and make a JSON object
// req.body = processes and makes it an obj

// Middleware 2
app.use(logReqRes("log.txt"));  

// Middleware 3
app.use((req,res,next) => { 
    // console.log("Validating user", req.myUserName);
    // return res.end("Hey")
    next();
})

app.use('/users', userRouter);
// All the requests starting with /user will be handled by userRouter, which is dealt in routes/user.js

// Server
app.listen(port, ()=>{
    console.log(`Server started on port ${port}` )
})