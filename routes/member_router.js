const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const secret = process.env.JWT_SECRET;
let members = [];
const { Member } = require('../models');
const isAuth = require('./authorization.js');

// 비밀번호 암호화
const create_hash = async (password, saltRound) => {
    let hashed = await bcrypt.hash(password, saltRound);
    console.log(`${password} : ${hashed}`);
    return hashed;
};

// 회원가입 http://{{host}}/members/sign-up

router.post('/sign-up', async (req, res)=>{
    const new_member = req.body;
    console.log(new_member);

    //입력한 아이디와 db에 저장된 아이디가 같은 회원 'id' 확인
    const options = { 
        attributes: ['id','password'],
        where: { member_id:new_member.member_id } //모델속성:키값
    }
    const result = await Member.findOne(options);
    console.log(result);

    if(result) {
        console.log("같은 아이디가 있음");
        // 같은 아이디가 있을때 오류 처리
        res.send({ success: false, message: '사용할 수 없는 ID 입니다.'});
    } else {
        console.log("같은 아이디가 없음");
        // 같은 아이디가 없을때 기존 회원가입 프로세스 처리
        new_member.password = await create_hash(new_member.password, 10);
        console.log(new_member);
        
        try{
            const result = await Member.create(new_member);
            res.send({ success: true, data:result });
        } catch(error){
            res.send({ success: false, message: error, error: error });
        };
    }
});


// 아이디 중복 체크
router.get('/sign-up', async (req, res)=>{
    const new_member_id = req.query.id;
    console.log(new_member_id);

    //입력한 아이디와 db에 저장된 아이디가 같은 회원 'id' 확인
    const options = { 
        attributes: ['id','password'],
        where: { member_id:new_member_id } //모델속성:키값
    }
    const result = await Member.findOne(options);
    console.log(result);

    if(result) {
        // 같은 아이디가 있을때 오류 처리
        res.send({ success: false, message: '사용할 수 없는 ID 입니다.'});
    } else {
        // 같은 아이디가 없을때
        res.send({ success: true, message: '사용할 수 있는 ID 입니다.'});
    }
});




// 회원 로그인 http://{{host}}/members/sign-in
router.post('/sign-in', async (req, res)=>{
    const { member_id, password } = req.body;
    const options = { //입력한 아이디와 db에 저장된 아이디가 같은 회원의 'id', 'password'를 options에 담음
        attributes: ['id','password'],
        where: { member_id:member_id } //모델속성:키값
    }
    const result = await Member.findOne(options);
    console.log(result);

    if(result){  //회원이 입력한 비밀번호와 db에 저장된 token 비교
        const compared = await bcrypt.compare(password, result.password);
        console.log(`${password} : ${result.password} : ${compared}`);
        if(compared){ //토큰 발행
            // const token = jwt.sign({ mid:result.id }, secret);
            const token = jwt.sign({ mid:result.id }, secret, { expiresIn: 60*60*24*1 });
            res.send({
                success: true,
                id:result.id,
                member_id: member_id,
                token: token
            });
        } else {
            res.send({ success: true, message: '사용자가 없거나 틀린 비밀번호입니다.'});
        };
    } else {
        res.send({ success: true, message: '사용자가 없거나 틀린 비밀번호입니다.'})
    }
});

//회원정보 가져오기
router.get('/memberinfo', isAuth, async (req, res)=>{
    const members_no = req.mid;
    console.log('members_no:', members_no);
    const result = await Member.findOne({
        attributes: [ 'member_id', 'member_name', 'created_at', 'updated_at'],
        where: { id: members_no },
        order: [['id', 'desc']]
    });
    res.send({ success:true, data:result });

});


//Logout
router.get('/logout', isAuth, async (req, res)=>{
    const members_no = req.mid;
    const result = await Member.findOne({
        attributes: ['member_id'],
        where: { id: members_no }
        });
        return res.send({success: true, data:result, message: "정상적으로 로그아웃됐습니다."})
});
 
module.exports = router;