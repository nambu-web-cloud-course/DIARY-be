const express = require('express');
const router = express.Router();
const isAuth = require('./authorization.js');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { Mydiary, Gallery, Member } = require('../models/index.js');
dotenv.config();
const port = process.env.PORT || 8080;
let gallery = [];

try{
    fs.readdirSync('files');
} catch(error) {
    console.error('files 폴더 새로 만듬');
    fs.mkdirSync('files');
};

//사용자 정의 스토리지 엔진 생성
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done){
            done(null, 'files/');
        },
        filename(req, file, done){ //저장할 파일이름 지정
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
            console.log("UploadedName : " + path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }), limits: { fileSize: 10 * 1024 * 1024 } //20MB 크기제한
});


//mydiary 새일기 저장 후 이미지 저장
router.post('/', isAuth, upload.array('image_path'), async (req, res)=>{

    var diary_no = 0;
    var msg_result = "";
    const new_diary = req.body;
    //console.log("Runtime :" + runtime++);
    console.log(new_diary);
    try{  
        const result = await Mydiary.create(new_diary); //새일기 저장
        console.log(result);
        //res.send({ success: true, data: result });

        // 저장된 일기의 다이어리 번호 확인
        console.log("result.Mydiary.dataValues.id : " + result.dataValues.id);
        diary_no = result.dataValues.id;
        msg_result = "일기 저장 완료/n";

    } catch(error) {
        res.send({ success: false, data:new_diary, message: "새일기 저장실패", error:error });
        return;
    };

    //일기저장 시 이미지 db저장    
    const files = req.files;
    // console.log(`File uploaded: ${files}`);
    
    // console.log(files[0]);
    try{
        files.map((image)=>{
            console.log('=====', image);
            const newimage = {diary_no:diary_no, image_path: image.path}
            Gallery.create(newimage);  //이미지 저장
            msg_result += "일기 이미지 저장 완료/n";
        })
    } catch(error){
        res.send({ success: false, message: "새일기 db저장실패", error:error });
        return;
    }
    
    res.status(200).send(msg_result);
});

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

//gallery 전체 가져오기(전체 목록) http://{{host}}/gallery/
router.get('/', isAuth, async (req, res)=>{
    const members_no = req.mid;
    console.log('members_no', members_no);
    if(members_no){ 
        const result = await Gallery.findAll({
            attributes: ['id','diary_no', 'image_path', 'created_at', 'updated_at'],
            order: [['id', 'desc']],
            include: [{
                model: Mydiary,
                where: { members_no: members_no },
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


// //mydiary 새일기 저장 후 이미지 저장
// router.post('/', isAuth, upload.array('image_path'), async (req, res)=>{

//     var diary_no = 0;
//     var msg_result = "";
//     const new_diary = req.body;
//     //console.log("Runtime :" + runtime++);
//     console.log(new_diary);
//     try{  
//         const result = await Mydiary.create(new_diary); //새일기 저장
//         console.log(result);
//         //res.send({ success: true, data: result });

//         // 저장된 일기의 다이어리 번호 확인
//         console.log("result.Mydiary.dataValues.id : " + result.dataValues.id);
//         diary_no = result.dataValues.id;
//         msg_result = "일기 저장 완료/n";

//     } catch(error) {
//         res.send({ success: false, data:new_diary, message: "새일기 저장실패", error:error });
//         return;
//     };

//     //일기저장 시 이미지 db저장    
//     const files = req.files;
//     console.log(`File uploaded: ${files}`);
    
//     console.log(files[0]);
//     try{
//         files.map((image)=>{
//             console.log('=====', image);
//             const newimage = {diary_no:diary_no, image_path: image.path}
//             Mydiaryimgs.create(newimage);  //이미지 저장
//         })
//         msg_result += "일기 이미지 저장 완료/n";
//     } catch(error){
//         res.send({ success: false, message: "새일기 db저장실패", error:error });
//         return;
//     }
    
//     res.status(200).send(msg_result);
// });



// if (req.files){ //파일을 불러오기위한 경로 + 이미지파일 이름
//     const filePath = "http://localhost:8080/mydiaryimgs/" + req.files.originalname;
//     newImage["image"] = filePath; //경로를 request의 json파일에 넣어 수정
// }

// const mydiaryImage = Mydiaryimgs.build(newImage);
// await mydiaryImage.save();

// //mydiary 에디터에서 일기저장 시 db 저장
// router.post('/', isAuth, upload.array('image_path'), async (req, res)=>{
//     //일기저장 시 이미지 db저장    
//     const files = req.files;
//         console.log(`File uploaded: ${files}`);
//         const diary_no = req.body.diary_no;
//         console.log(files[0]);
//         try{
//             files.map((image)=>{
//                 console.log('=====', image);
//                 const newimage = {diary_no:diary_no, image_path: image.path}
//                 Mydiaryimgs.create(newimage);
//             })
//             res.status(200).send('File uploaded successfully.');
//         } catch(error){
//             res.send({ success: false, message: "새일기 db저장실패", error:error });
//         }
//     //일기 저장시 이미지 제외한 text 저장(cate_date 정보는??)
//     if(diary_no){
//         const result = await Mydiary.findAll({
//             attributes: [ 'diary_content', 'created_at', 'updated_at'],
//             where: { id: diary_no },
//             order: [['id', 'desc']],
//             include:[
//                 {
//                     model:Mydiaryimgs,
//                     where: { diary_no:diary_no},
//                     attributes: ['diary_no', 'image_path', 'created_at', 'updated_at'],
//                     order:[['id', 'desc']]
//                 }
//             ]

//         }); res.send({ success:true, data:result });

//     } else { 
//             const result = await Mydiaryimgs.findAll({
//             attributes: ['id', 'diary_no', 'image_path', 'created_at', 'updated_at'],
//             order: [[ 'id', 'desc' ]]
//         });
//         res.send({ success:true, data:result });
//     }
// });


