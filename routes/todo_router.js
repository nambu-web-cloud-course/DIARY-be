const express = require('express');
const router = express.Router();
const isAuth = require('./authorization.js');
const {  Member, Todo } = require('../models');
let todos = [];

//할일 등록(추가)하기 http://{{host}}/todos/ -->[body] 1)"members.no": 1, 2)"todo_content": "aaa"
router.post('/', async (req, res)=>{
    const new_todo = req.body;
    console.log(`new_todo : ${new_todo}`);
    res.header("Access-Control-Allow-Origin", "*");
    try{
        // new_todo.id = req.id;
        const result = await Todo.create(new_todo);
        console.log(result);
        res.send({ success: true, data: new_todo });
    } catch(error) {
        res.send({ success: false, data:new_todo, message: "할일 등록실패", error:error });
    };
});


//사용자가 작성한 할일(todo) 전체 가져오기(전체 목록) http://{{host}}/todos/
//id로 내가 쓴 할일(todo) 가져오기(query) http://{{host}}/todos?id=1
router.get('/', async (req, res)=>{
    const members_no = req.query.id;
    console.log('members_no:', members_no);
    res.header("Access-Control-Allow-Origin", "*");
    if(members_no){  //query로 id 입력시
        const result = await Member.findAll({
            attributes: [ 'id', 'member_name', 'created_at', 'updated_at'],
            order: [['id', 'desc']],
            where: { members_no: members_no },
            include: [
                {
                    model: Todo,
                    where: { members_no: members_no },
                    attributes: ['todo_content', 'created_at', 'updated_at'],
                    order: [['id', 'desc']]
                },
            ]
        });
        res.send({ success:true, data:result });
    } else { //query로 id 입력하지 않았을때 전체목록
        const result = await Todo.findAll({
            attributes: ['id', 'todo_content', 'created_at', 'updated_at'],
            order: [[ 'id', 'desc' ]],
        });
        res.send({ success:true, data:result });
    };
});


//members_no로 내 할일 가져오기 http://{{host}}/todos/1
router.get('/:id', async (req, res)=>{
    const members_no = req.params.members_no;
    const result =  await Todo.findAll ({
        where: { members_no: members_no },
        attributes: ['id', 'todo_content', 'created_at', 'updated_at'],
    })
    res.send({ success:true, data: result });
})

//todo_no로 해당 할일 수정하기 http://{{host}}/todos/1
router.put('/:todo_no', async (req, res)=>{
    const todo_no = req.params.todo_no;
    const result = await Todo.update(
        req.body,
        { where: { members_no: todo_no }}
    );
    console.log(result);
    req.body.id = todo_no;
    res.send({ success: true, data: req.body });
});

//todo_nof 해당일기 삭제하기 http://{{host}}/todos/1
router.delete('/:todo_no', async (req, res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    const todo_no = req.params.todo_no;
    const result = await Todo.destroy({
        where: { members_no: todo_no }
    });
    console.log(result);
    req.body.id = todo_no;
    res.send({ success:true, data:req.body })
})

module.exports = router;