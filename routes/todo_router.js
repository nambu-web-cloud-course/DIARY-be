const express = require('express');
const router = express.Router();
const isAuth = require('./authorization.js');
const {  Member, Todo } = require('../models');
const { Op, DATE } = require('sequelize');
const Sequelize = require('sequelize');
let todos = [];

//할일 등록(추가)하기 http://{{host}}/todos/ -->[body] 1)"members.no": 1, 2)"todo_content": "aaa"
router.post('/', isAuth, async (req, res)=>{
    const new_todo = req.body;
    new_todo.members_no = req.mid
    console.log(`new_todo : ${new_todo.todo_content} ${new_todo.members_no}`);
   
    try{
        // new_todo.id = req.id;
        const result = await Todo.create(new_todo);
        console.log(result);
        res.send({ success: true, data: result });
    } catch(error) {
        res.send({ success: true, message: "할일 등록실패", error:error });
    };
});


//사용자가 작성한 할일(todo) 전체 가져오기(전체 목록) http://{{host}}/todos/
//로그인된 id로 내가 쓴 할일(todo) 가져오기(query) 
router.get('/', isAuth, async (req, res)=>{
    const members_no = req.mid
    // console.log('members_no:', members_no);

    const params = req.query;
    console.log('members_no', members_no, 'params', params);

    if(members_no) {
        if( params ){ //query로 검색 조건값 입력 시 
            const result = await Todo.findAll({
                attributes: [
                                'id', 'todo_content', 'created_at', 'updated_at', 
                            ],
                where: { 
                    members_no: members_no,
                    todo_date : {
                            [Op.and]: {
                                    [Op.gte]: params.StartDate, // 이상
                                    [Op.lte]: params.EndDate, // 이하
                            }
                        }, 
                 },
                // order: [[ 'id', 'desc' ]],
            });
            res.send({ success:true, data:result });
        } else {
            const result = await Todo.findAll({
                attributes: ['id', 'todo_content', 'created_at', 'updated_at'],
                where: { members_no: members_no },
                order: [[ 'id', 'desc' ]],
            });
            res.send({ success:true, data:result });        
        }

    }  else { //query로 id 입력하지 않았을때 전체목록
        res.send({ success: true, message: "할일 가져오기실패"});
    };
});




//지정된 할일 가져오기 http://{{host}}/todos/1
//로그인한 회원 번호는 기본 검색 조건
router.get('/:id', isAuth, async (req, res)=>{
    const id = req.params.id;
    const members_no = req.mid
    res.header("Access-Control-Allow-Origin", "*");
    const result =  await Todo.findAll ({
        where: { id: id, members_no: members_no },
        attributes: ['id', 'todo_content', 'created_at', 'updated_at'],
    })
    res.send({ success:true, data: result });
})


//todo_no로 해당 할일 수정하기 http://{{host}}/todos/1
router.put('/:todo_no', isAuth, async (req, res)=>{
    const todo_no = req.params.todo_no;
    const members_no = req.mid
    const result = await Todo.update(
        req.body,
        { where: { id: todo_no, members_no: members_no}}
    );
    console.log(result);
    req.body.id = todo_no;
    res.send({ success: true, data: req.body });
});

//todo_no로 해당 todo 삭제하기 http://{{host}}/todos/1
router.delete('/:todo_no', isAuth, async (req, res)=>{
    const todo_no = req.params.todo_no;
    const members_no = req.mid
    const result = await Todo.destroy(
        { where: { id: todo_no, members_no: members_no}}
    );
    console.log(result);
    res.send({ success:true, data:result })
})

module.exports = router;