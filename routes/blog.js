const express = require('express');

const router = express.Router();

router.get('/', (req, res)=>{
    res.send("This is blog homepage");
})

router.get('/about', (req, res)=>{
    res.send("This is blog about page");
})

router.get('/blogpost/:slug', (req, res)=>{
    res.send(`fetch blogpost for ${req.params.slug}`);
})

module.exports = router;
