const mongoose = require('mongoose');

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

module.exports = User;