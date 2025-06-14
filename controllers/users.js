const User = require('../models/users')

async function handleAllUsers(req,res){
    const users = await User.find({});
    res.setHeader('X-My-Name', "Maaz Ahmad");
    return res.json(users);
    // return res.json() because the user data is json.
    // It automatically sets the Content-type to application/json

    // We can also use res.send() but since this is json so this is preferred.
    // send is all purpose, if there was a string sets the Content-type to application/text
}


async function handleGetUser(req,res){
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
}

async function handleUpdateUserById(req,res){
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
}

async function handleDeleteById(req,res){
    // let id = Number(req.params.id);
    // const users = await User.find({});

    let id = await User.findByIdAndDelete(req.params.id);
    
    if(id === -1){
        return res.status(404).json({status: "Not found"});
    }
    
    // users = users.filter(user => user.id !== id);

    return res.status(200).json({msg: "Deleted"});
}

async function handleAddNewUser(req,res){
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

    return res.status(201).json({msg: "Success", id: result._id})
}

module.exports = {
    handleAllUsers,
    handleGetUser,
    handleUpdateUserById,
    handleDeleteById,
    handleAddNewUser
}