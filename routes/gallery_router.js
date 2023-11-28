const express = require('express');
const router = express.Router();
const isAuth = require('./authorization.js');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { Mydiary, Gallery, Member } = require('../models/index.js');
const { Op } = require('sequelize');
dotenv.config();
const port = process.env.PORT || 8080;
let gallery = [];

//gallery 전체 가져오기(전체 목록) http://{{host}}/gallery/
// router.get('/', isAuth, async (req, res)=>{
//     const members_no = req.mid;
//     console.log('members_no', members_no);
//     if(members_no){ 
//         const result = await Gallery.findAll({
//             attributes: ['id','diary_no', 'image_path', 'created_at', 'updated_at'],
//             order: [['id', 'desc']],
//             include: [{
//                 model: Mydiary,
//                 where: { members_no: members_no },
//                 attributes: ['id', 'members_no'],
//                 order: [['id', 'desc']]
//                 }] 
//         });
//         res.send({ success:true, data:result });
//     } else { 
//         res.send({ success:true, data:"none" });
//     };
// });
router.get('/', isAuth, async (req, res)=>{
    const members_no = req.mid;
    // const params = req.params;
    const params = req.query;
    const startDate = '2023-11-01 00:00:00';
    const endDate = '2023-12-01 00:00:00';
    console.log('members_no', members_no, 'params', params);
    if(members_no){ 
        const result = await Gallery.findAll({
            attributes: ['id','diary_no', 'image_path', 'created_at', 'updated_at'],
            where: {
                created_at : {
                    [Op.and]: {
                    [Op.gte]: startDate, // 이상
                    [Op.lte]: endDate, // 이하
                    }
                }
            },
            order: [['id', 'desc']],
            include: [{
                model: Mydiary,
                where: { members_no: members_no},
                attributes: ['id', 'members_no'],
                order: [['id', 'desc']]
                }] 
        });
        res.send({ success:true, data:result });
    } else { 
        res.send({ success:true, data:"none" });
    };
});





//diary_no로 가져오기(query) http://{{host}}/gallery/
router.get('/:diary_no', isAuth, async (req, res)=>{
    const diary_no = req.params.diary_no;
    const members_no = req.mid;
    console.log('diary_no', diary_no);
    if(diary_no){ 
        const result = await Gallery.findAll({
            attributes: ['id','diary_no', 'image_path', 'created_at', 'updated_at'],
            order: [['id', 'desc']],
            include: [{
                model: Mydiary,
                where: { id: diary_no, members_no: members_no },
                attributes: ['id', 'diary_title', 'diary_content', 'cate_data_no', 'created_at', 'updated_at'],
                order: [['id', 'desc']]
                }] 
        });
        res.send({ success:true, data:result });
    } else { //query로 id 입력하지 않았을때 전체목록
        res.send({ success:true, data:"none" });
    };
});


//diary_no로 해당일기 삭제하기 http://{{host}}/gallery/1
router.delete('/:gallery_no', isAuth, async (req, res)=>{
    const gallery_no = req.params.gallery_no;
    
    var result = await Gallery.destroy({
        where: { id: gallery_no }
    });

    console.log(result);
    res.send({ success:true, data:result })
})

module.exports = router;


//gallery 전체 가져오기(전체 목록) http://{{host}}/gallery/
//diary_no로 가져오기(query) http://{{host}}/gallery?diary_no=1
// router.get('/', isAuth, async (req, res)=>{
//     const diary_no = req.query.diary_no;
//     console.log('diary_no', diary_no);
//     if(diary_no){  
//         const result = await Gallery.findAll({
//             attributes: ['img_path', 'created_at', 'updated_at'],
//             where: { diary_no: diary_no },
//             order: [['id', 'desc']]
//         });
//         res.send({ success:true, data:result });
//     } else { 
//         const result = await Gallery.findAll({
//             attributes: ['id', 'img_path', 'created_at', 'updated_at'],
//             order: [[ 'id', 'desc' ]],
//         });
//         res.send({ success:true, data:result });
//     };
// });