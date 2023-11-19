const express = require('express');
const router = express.Router();
const isAuth = require('./authorization.js');
const { Mydiary, Cate_data } = require('../models');
let cate_data = [];

//cate_data 등록하기 http://{{host}}/cate_data/ -->body에 cate_data입력
router.post('/', async (req, res)=>{
    const new_cate = req.body;
    console.log(new_cate);
    try{
        const result = await Cate_data.create(new_cate);
        console.log(result);
        res.send({ success: true, data: result });
    } catch(error) {
        res.send({ success: true, message: "category 등록실패", error:error });
    };
});

//cate_data 전체 가져오기(전체 목록) http://{{host}}/cate_data/
router.get('/', isAuth, async (req, res)=>{
    const cate_data = req.body;
    console.log('cate_data', cate_data);
    try{
        const result = await Cate_data.findAll({
            attributes: ['id', 'cate_data', 'created_at', 'updated_at'],
            order: [[ 'id', 'desc' ]],
        });
        res.send({ success:true, data:result });
    } catch(error){
        res.send({ success: true, message: "카테고리 가져오기 실패", error:error });
    };
    
});

// 구현 필요부 재확인 -w-
// //diary_no로 가져오기(query) http://{{host}}/cate_data?diary_no=1/
// router.get('/diary_no', isAuth, async (req, res)=>{
//     const diary_no = req.query.diary_no;
//     console.log('id', diary_no);
//     if(diary_no){  //query로 id 입력시
//         const result = await Cate_data.findAll({
//             attributes: ['cate_data', 'created_at', 'updated_at'],
//             order: [['id', 'desc']],
//             where: { id: diary_no },
//             include: [
//                 {
//                     model: Mydiary,
//                     where: { cate_data_no: diary_no },
//                     attributes: ['id', 'cate_data', 'created_at', 'updated_at'],
//                     order: [['id', 'desc']]
//                 },
//             ]
//         });
//         res.send({ success:true, data:result });
//     } else { //query로 id 입력하지 않았을때 전체목록
//         const result = await Cate_data.findAll({
//             attributes: ['id', 'cate_data', 'created_at', 'updated_at'],
//             order: [[ 'id', 'desc' ]],
//         });
//         res.send({ success:true, data:result });
//     };
// });

module.exports = router;