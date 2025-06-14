const fs = require('fs')
const express = require('express')

function logReqRes(filename){
    return (req,res,next) => {
    // req.myUserName = "Maaz";
    fs.appendFile(filename, `${req.method} request on ${req.url} at ${new Date().toISOString()} \n`, (err)=>{
        if(err){
            console.log("Failed to write:", err);
        }
    }); 
    // req.myUserName = "Maaz";
    next();
    }
}

function static(foldername){
    return express.static(foldername);
}

module.exports = {
    logReqRes,
    static
}