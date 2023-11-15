const express = require('express');
const router = express.Router();
const isAuth = require('./authorization.js');
const { Mydiary, Cate_data } = require('../models');
let cate_data = [];

//cate_data 등록하기 http://{{host}}/cate_data/ -->body에 cate_data입력
router.post('/', isAuth, async (req, res)=>{
    const new_cate = req.body;
    console.log(new_cate);
    try{
        const result = await Cate_data.create(new_cate);
        console.log(result);
        res.send({ success: true, data: new_cate });
    } catch(error) {
        res.send({ success: false, data:new_cate, message: "category 등록실패", error:error });
    };
});

//사용자가 선택한 카테고리 데이터 불러오기???
//cate_data 전체 가져오기(전체 목록) http://{{host}}/cate_data/
//diary_no로 가져오기(query) http://{{host}}/cate_data?diary_no=1/
router.get('/diary_no', isAuth, async (req, res)=>{
    const diary_no = req.query.diary_no;
    console.log('id', diary_no);
    if(diary_no){  //query로 id 입력시
        const result = await Mydiary.findAll({
            attributes: ['members_no', 'created_at', 'updated_at'],
            order: [['id', 'desc']],
            where: { id: diary_no },
            include: [
                {
                    model: Cate_data,
                    where: { diary_no: diary_no },
                    attributes: ['cate_data', 'created_at', 'updated_at'],
                    order: [['id', 'desc']]
                },
            ]
        });
        res.send({ success:true, data:result });
    } else { //query로 id 입력하지 않았을때 전체목록
        const result = await Cate_data.findAll({
            attributes: ['id', 'cate_data', 'created_at', 'updated_at'],
            order: [[ 'id', 'desc' ]],
        });
        res.send({ success:true, data:result });
    };
});

module.exports = router;