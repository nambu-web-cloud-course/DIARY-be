const express = require('express');
const router = express.Router();
const isAuth = require('./authorization.js');
const { Mydiary, Gallery } = require('../models');
let gallery = [];

//gallery 전체 가져오기(전체 목록) http://{{host}}/gallery/
//id로 가져오기(query) http://{{host}}/gallery?diary_no=1
router.get('/diary_no', isAuth, async (req, res)=>{
    const diary_no = req.query.diary_no;
    console.log('diary_no', diary_no);
    if(diary_no){  //query로 id 입력시
        const result = await Gallery.findAll({
            attributes: ['diary_img_path', 'created_at', 'updated_at'],
            where: { diary_no: diary_no },
            order: [['id', 'desc']]
        });
        res.send({ success:true, data:result });
    } else { //query로 id 입력하지 않았을때 전체목록
        const result = await Gallery.findAll({
            attributes: ['id', 'diary_img_path', 'created_at', 'updated_at'],
            order: [[ 'id', 'desc' ]],
        });
        res.send({ success:true, data:result });
    };
});

module.exports = router;