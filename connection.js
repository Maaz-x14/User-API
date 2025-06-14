const mongoose = require('mongoose');

async function connectMongoDB(url){
    // Connection
    return mongoose.connect(url);
}

module.exports = {
    connectMongoDB
}