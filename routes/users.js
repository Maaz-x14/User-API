const express = require('express');
const User = require('../models/users')
const { handleAllUsers, handleGetUser, handleUpdateUserById, handleDeleteById, handleAddNewUser } = require('../controllers/users')

const router = express.Router();

// Routes
// We should use /api before our route, it means that this route would return json data
// if there is no api it means it would render html document
// router.get('/', (req,res)=>{
//     res.sendFile("res_methods.png", {root: __dirname});
// })

// router.get('/', async (req,res) => {
//     const users = await User.find({});
//     const html = `
//         <ul>
//             ${users.map((user)=> `<li>${user.firstName} - ${user.email}</li>`).join("")}
//         </ul>
//     `
//     res.send(html);
// })


// REST APIs
router
    .route('/')
    .get(handleAllUsers)
    .post(handleAddNewUser)

// For making dynamic routes we use dynamic route paramters.
// GET /api/users/:id   , where :id  <-- Variable
router
    .route('/:id')
    .get(handleGetUser)
    .patch(handleUpdateUserById)
    .delete(handleDeleteById)

module.exports = router;