const express = require('express');

const mongoose = require('mongoose');
const fs = require('fs');

const blog = require('./routes/blog');

// let users = require('./MOCK_DATA.json');
const { timeStamp } = require('console');
const { dirname } = require('path');

// Initialize app
const app = express();
const port = 3000;

// Connection
mongoose.connect('mongodb://127.0.0.1:27017/myDB').then(()=>{
    console.log("MongoDB Connected")    
}).catch( err => console.log("Connection Failed:", err));

// Schema
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    gender: { type: String },
    jobTitle: { type: String }
},{ timestamps: true }
)

// Model <== Using this model we can interact with mongoDB
const User = new mongoose.model('user', userSchema);

// Middleware to get blog route
app.use('/blog', blog)

// Middleware 0
app.use(express.urlencoded({extended: false}));
// Returns middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option

// Middleware 1
app.use(express.json());
// Returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option.

// It processes the body of request and make a JSON object
// req.body = processes and makes it an obj

// Middleware 2
app.use((req,res,next) => {
    // req.myUserName = "Maaz";
    fs.appendFile('log.txt', `${req.method} request on ${req.url} at ${new Date().toISOString()} : ${req.ip} \n`, (err)=>{
        if(err){
            console.log("Failed to write:", err);
        }
    }); 
    // req.myUserName = "Maaz";
    next();
})

// Middleware 3
app.use((req,res,next) => { 
    // console.log("Validating user", req.myUserName);
    // return res.end("Hey")
    next();
})

// Routes
// We should use /api before our route, it means that this route would return json data
// if there is no api it means it would render html document
app.get('/', (req,res)=>{
    res.sendFile("res_methods.png", {root: __dirname});
})

app.get('/users', async (req,res) => {
    const users = await User.find({});
    const html = `
        <ul>
            ${users.map((user)=> `<li>${user.firstName} - ${user.email}</li>`).join("")}
        </ul>
    `
    res.send(html);
})


// REST APIs
app.get('/api/users', async (req,res)=>{
    const users = await User.find({});
    res.setHeader('X-My-Name', "Maaz Ahmad")
    return res.json(users);
    // return res.json() because the user data is json.
    // It automatically sets the Content-type to application/json

    // We can also use res.send() but since this is json so this is preferred.
    // send is all purpose, if there was a string sets the Content-type to application/text
})

// For making dynamic routes we use dynamic route paramters.
// GET /api/users/:id   , where :id  <-- Variable
app
    .route('/api/users/:id')
    .get(async (req,res)=>{

        const user = await User.findById(req.params.id);

        // res.setHeader('X-Request-Keri-A', "GET");
        // For custom headers add an X before --> X-Request-Keri-A
        // console.log(req.headers);
        // const id = Number(req.params.id);
        // const user = users.find(user => user.id === id);
        if(!user){
            return res.status(404).json({error: "User doesn't exist"});
        }
        res.json(user);
    })
    .patch(async (req,res)=>{
        const body = req.body;

        let user = await User.findByIdAndUpdate(req.params.id, {
            firstName: body.first_name,
            lastName: body.last_name,
            gender: body.gender,
            email: body.email,
            jobTitle: body.job_title
        })
        // const id = Number(req.params.id);
        
        // let userId = users.findIndex(user => user.id === id);

        if(!user){
            return res.status(404).json({status: "Not found"});
        }

        // users[userId] = {...users[userId], ...body};      
        // fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err)=>{
        //     if(err){
        //         return res.json({status: "error"}).status(500);
        //     }
        //     return res.json({status: "success", id: id})
        // });

        return res.status(200).json({msg: "Changed"});
    })
    .delete(async (req,res)=>{
        // let id = Number(req.params.id);
        // const users = await User.find({});

        let id = await User.findByIdAndDelete(req.params.id);
        
        if(id === -1){
            return res.status(404).json({status: "Not found"});
        }
        
        // users = users.filter(user => user.id !== id);

        return res.status(200).json({msg: "Deleted"});
    })


    
app.post('/api/users', async (req,res)=>{
    // Express doesn't know what type of data is sent in body, it doesn't know how to handle it.
    // So we have to use a middleware   
    const body = req.body;  
    // const maxId = (users.length > 0) ? Math.max(...users.map(user => user.id)) : 0;
    // const newId = maxId + 1;

    if(!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title){
        return res.status(400).json({status: "All fields required"});
    }
    
    const result = await User.create({
        firstName: body.first_name,
        lastName: body.last_name,
        email: body.email,
        gender: body.gender,        
        jobTitle: body.job_title
    })

    console.log("Result:", result);

    return res.status(201).json({msg: "Success"})
})

// app.get('/api/users/:id', (req,res)=>{
//     const id = Number(req.params.id);
//     const user = users.find(user => user.id === id);
//     res.json(user);
// })



// Server
app.listen(port, ()=>{
    console.log(`Server started on port ${port}` )
})