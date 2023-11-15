const express = require('express');
const router = express.Router();

const multer = require('multer');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 8080;


// const isAuth = require('./authorization.js');
// const { Mydiary } = require('../models');

try{
    fs.readdirSync('files');
} catch(error) {
    console.error('files 폴더 새로 만듬');
    fs.mkdirSync('files');
};

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done){
            done(null, 'files/');
        },
        filename(req, file, done){
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
            // console.log("UploadedName : " + path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }), limits: { fileSize: 10 * 1024 * 1024 }
});

router.post(
    '/uploadimages',
    upload.array('image'), (req, res)=>{
        console.log(req.files);
        console.log(req.body);
        res.send('ok');
    });


module.exports = router;