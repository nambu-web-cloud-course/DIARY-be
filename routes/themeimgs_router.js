const express = require('express');
const router = express.Router();
const isAuth = require('./authorization.js');
const { Themeimgs } = require('../models');
let themeimgs = [];

// //배경테마 등록하기 http://{{host}}/themeimgs/
// router.post('/', isAuth, async (req, res)=>{
//     const new_themeimgs = req.body;
//     console.log(new_themeimgs);
//     try{
      
//         const result = await Themeimgs.create(new_themeimgs);
//         console.log(result);
//         res.send({ success: true, data: themeimgs });
//     } catch(error) {
//         res.send({ success: false, data:themeimgs, message: "등록실패", error:error });
//     };
// });


//themeimgs 전체 가져오기(전체 목록) http://{{host}}/themeimgs/
//themeimg_no로 가져오기(query) http://{{host}}/themeimgs/
// router.get('/', async (req, res)=>{
//     const themeimgs = req.body;
//     console.log('themeimgs', themeimgs);
//     try{
//         const result = await Themeimgs.findAll({
//             attributes: ['id', 'themeimgs_title', 'themeimgs_path', 'created_at', 'updated_at'],
//             order: [[ 'id', 'desc' ]],
//         });
//         res.send({ success:true, data:result });
//     } catch(error){
//         res.send({ success: false, data:themeimgs, message: "배경테마 가져오기 실패", error:error });
//     };
    
// });

// router.get('/themeimgs', (req, res)=>{
//     res.send(req.body);
// })

// router.get('/themeimgs', async (req, res)=>{
//     try{
//         const result = await Themeimgs.findAll({
//             attributes: ['id', 'themeimgs_title', 'themeimgs_path', 'created_at', 'updated_at'],
//             order: [[ 'id', 'desc' ]],
//         });
//         res.send({ success:true, data:result });
//     } catch(error){
//         res.send({ success: false, data:themeimgs, message: "배경테마 가져오기 실패", error:error });
//     };
    
// });


module.exports = router;