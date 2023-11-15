
const express = require('express');
const router = express.Router();
const isAuth = require('./authorization.js');
const { Member, Mydiary } = require('../models');
let mydiaries = [];

//새 일기 등록하기 http://{{host}}/mydiaries/ -->body에 새일기 값 입력
router.post('/', isAuth, async (req, res)=>{
    const new_diary = req.body;
    console.log(new_diary);
    try{
        // new_diary.id = req.id;
        const result = await Mydiary.create(new_diary);
        console.log(result);
        res.send({ success: true, data: new_diary });
    } catch(error) {
        res.send({ success: false, data:new_diary, message: "새일기 등록실패", error:error });
    };
});

//사용자가 작성한 일기 전체 가져오기(일기 전체 목록) http://{{host}}/mydiaries/
//id로 내가 쓴 일기가져오기(query) http://{{host}}/mydiaries?id=1
router.get('/', isAuth, async (req, res)=>{
    const members_no = req.query.id;
    console.log('members_no:', members_no);
    if(members_no){ //query로 id 입력시
        const result = await Member.findAll({
            attributes: [ 'member_id', 'member_name', 'created_at', 'updated_at'],
            order: [['id', 'desc']],
            where: { id: members_no },
            include: [
                {
                    model: Mydiary,
                    where: { members_no: members_no },
                    attributes: ['diary_title', 'diary_content','cate_data', 'created_at', 'updated_at'],
                    order: [['id', 'desc']]
                },
            ] 
        });
        res.send({ success:true, data:result });
    } else { //query로 id 입력하지 않았을 때 일기 전체목록
            const result = await Mydiary.findAll({
            attributes: ['id', 'diary_title', 'diary_content', 'cate_data', 'created_at', 'updated_at'],
            order: [[ 'id', 'desc' ]]
        });
        res.send({ success:true, data:result });
    };
});

//members_no로 내가 쓴 일기 가져오기 http://{{host}}/mydiaries/1
router.get('/:members_no', isAuth, async (req, res)=>{
    const members_no = req.params.members_no;
    const result =  await Mydiary.findAll ({
        where: { members_no: members_no },
        attributes: ['id', 'diary_title', 'diary_content', 'cate_data', 'created_at', 'updated_at'],
        order: [[ 'id', 'desc' ]]
    })
    res.send({ success:true, data:result });
})

//diary_no 로 해당 일기 수정하기 http://{{host}}/mydiaries/1
router.put('/:diary_no', isAuth, async (req, res)=>{
    const diary_no = req.params.diary_no;
    const result = await Mydiary.update(
        req.body,
        { where: { id: diary_no }}
    );
    console.log(result);
    req.body.id = diary_no;
    res.send({ success: true, data: req.body });
});

//diary_no로 해당일기 삭제하기 http://{{host}}/mydiaries/1
router.delete('/:diary_no', isAuth, async (req, res)=>{
    const diary_no = req.params.diary_no;
    const result = await Mydiary.destroy({
        where: { id: diary_no }
    });
    console.log(result);
    res.send({ success:true, data:result })
})


module.exports = router;