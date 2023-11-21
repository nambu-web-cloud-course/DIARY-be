const MulterAzureStorage = require('multer-azure-blob-storage').MulterAzureStorage

const fs = require('fs');
const path = require('path');

const multer = require('multer');
const express = require('express');
const router = express.Router();
const isAuth = require('./authorization.js');
const { Member, Mydiary, Gallery } = require('../models');
let mydiaries = [];

// const dotenv = require('dotenv');
// dotenv.config();

//새 일기 등록하기 http://{{host}}/mydiaries/ -->body에 새일기 값 입력

//사용자 정의 스토리지 엔진 생성
// const upload = multer({
//     storage: multer.diskStorage({
//         destination(req, file, done){
//             done(null, 'files/');
//         },
//         filename(req, file, done){ //저장할 파일이름 지정
//             const ext = path.extname(file.originalname);
//             done(null, path.basename(file.originalname, ext) + Date.now() + ext);
//             console.log("UploadedName : " + path.basename(file.originalname, ext) + Date.now() + ext);
//         },
//     }), limits: { fileSize: 10 * 1024 * 1024 } //20MB 크기제한
// });

// const connection = 'DefaultEndpointsProtocol=https;AccountName=stmemediary;AccountKey=nAMoIH0i7v05I00jYAsZo3y36ytfVPjBEFF4Q3S4/HYu4dtn2OGZ0jtYwJmYXUAnYHbrdVjoxoNZ+AStVUc9Xw==;EndpointSuffix=core.windows.net';
// const azureKey = 'nAMoIH0i7v05I00jYAsZo3y36ytfVPjBEFF4Q3S4/HYu4dtn2OGZ0jtYwJmYXUAnYHbrdVjoxoNZ+AStVUc9Xw==';
// const accountName ='stmemediary';

const connection = process.env.AZURE_STORAGE_CONNECTION;
const azureKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;

const getBlobName = (req, file)=>{
    // const ext = path.extname(file.orignalname);
    // console.log(`orignalname:${file.originalname}, ext:${ext}`)
    // console.log(`filename: ${file}`);
    return String(Date.now())+file.originalname;
};

const azureStorage = new MulterAzureStorage({
    connectionString: connection,
    accessKey: azureKey,
    accountName: accountName,
    containerName: 'images',
    blobName: getBlobName,
    constainerAccessLevel: 'blob', //익명 액세스 수준 설정 'private', 'blob', 'container'
    urlExpirationTime: -1, //url에 공용액세스 기한 없애는 기능
});

const upload = multer({
    storage: azureStorage
});

//mydiary 새일기 저장 후 이미지 저장
router.post('/', isAuth, upload.array('image_path'), async (req, res)=>{
   
    var diary_no = 0;
    var msg_result = "";
    const new_diary = req.body;
    new_diary.members_no = req.mid
    //console.log("Runtime :" + runtime++);
    console.log(new_diary);
    console.log(`new_diary : ${new_diary.diary_content} ${new_diary.members_no}`);
    try{  
        const result = await Mydiary.create(new_diary); //새일기 저장
        // console.log(result);
        //res.send({ success: true, data: result });

        // 저장된 일기의 다이어리 번호 확인
        console.log("result.Mydiary.dataValues.id : " + result.dataValues.id);
        diary_no = result.dataValues.id;
        // res.send({ success:true, data:result, msg_result:"일기 저장 완료" })
        msg_result = "일기 저장 완료/n";

    } catch(error) {
        return res.send({ success: true, data:new_diary, message: "새일기 저장실패", error:error });
    };

    //일기저장 시 이미지 db저장    
    const files = req.files;
    console.log(`File uploaded: ${files}`);
    
    // console.log(files[0]);
    try{
        files.map((image)=>{
            console.log('=====', image);
            const imageUrl = image.url.split('?')[0]; //url ? 앞에까지 split해서 저장
            const newimage = {diary_no:diary_no, image_path: imageUrl};
            // const newimage = {diary_no:diary_no, image_path: image.url};
            console.log(`File saved: ${newimage}`);
            Gallery.create(newimage);  //이미지 저장
            msg_result += "일기 이미지 저장 완료/n";
        })
    } catch(error){
        return res.send({ success: true, message: "새일기 db저장실패", error:error });
    }
    
    return res.status(200).send(msg_result);
});


//새 일기 등록하기 http://{{host}}/mydiaries/ -->body에 새일기 값 입력
// router.post('/', isAuth, async (req, res)=>{
//     const new_diary = req.body;
//     console.log(new_diary);
//     try{
//         // new_diary.id = req.id;
//         const result = await Mydiary.create(new_diary);
//         console.log(result);
//         res.send({ success: true, data: result });
//     } catch(error) {
//         res.send({ success: false, data:new_diary, message: "새일기 등록실패", error:error });
//     };
// });

//사용자가 작성한 일기 전체 가져오기(일기 전체 목록) http://{{host}}/mydiaries/
router.get('/', isAuth, async (req, res)=>{
    const members_no = req.mid;
    console.log('members_no:', members_no);
    if(members_no){ //query로 id 입력시
        const result = await Member.findAll({
            attributes: [ 'member_id', 'member_name', 'created_at', 'updated_at'],
            where: { id: members_no },
            order: [['id', 'desc']],
            include: [
                {
                    model: Mydiary,
                    where: { members_no: members_no },
                    attributes: ['diary_title', 'diary_content','cate_data_no', 'created_at', 'updated_at'],
                    order: [['id', 'desc']]
                },
            ] 
        });
        res.send({ success:true, data:result });
    } else { //query로 id 입력하지 않았을 때 일기 전체목록
            const result = await Mydiary.findAll({
            attributes: ['id', 'diary_title', 'diary_content', 'cate_data_no', 'created_at', 'updated_at'],
            order: [[ 'id', 'desc' ]]
        });
        res.send({ success:true, data:result });
    };
});

//사용자가 작성한 일기 전체 가져오기(일기 전체 목록) http://{{host}}/mydiaries/
router.get('/:diary_no', isAuth, async (req, res)=>{
    const members_no = req.mid;
    const diary_no = req.params.diary_no;
    console.log('members_no:', members_no, 'diary_no', diary_no);

    const result = await Mydiary.findAll({
        attributes: [ 'id', 'diary_title', 'diary_content','cate_data_no', 'created_at', 'updated_at'],
        where: { id: diary_no, members_no: members_no },
        order: [['id', 'desc']],
        include: [
            {
                model: Gallery,
                where: { diary_no: diary_no },
                attributes: ['id', 'image_path', 'created_at', 'updated_at'],
                order: [['id', 'desc']]
            },
        ] 
    });
    res.send({ success:true, data:result });

});

// //members_no로 내가 쓴 일기 가져오기 http://{{host}}/mydiaries/1
// router.get('/:members_no', isAuth, async (req, res)=>{
//     const members_no = req.params.members_no;
//     const result =  await Mydiary.findAll ({
//         where: { members_no: members_no },
//         attributes: ['id', 'diary_title', 'diary_content', 'cate_data_no', 'created_at', 'updated_at'],
//         order: [[ 'id', 'desc' ]]
//     })
//     res.send({ success:true, data:result });
// })

//diary_no 로 해당 일기 수정하기 http://{{host}}/mydiaries/1
router.put('/:diary_no', isAuth, upload.array('image_path'), async (req, res)=>{
    const diary_no = req.params.diary_no;
    const put_diary = req.body;
    const members_no = req.mid;
    
    var msg_result = "";
    
    console.log(put_diary);
    console.log(`put_diary : ${put_diary.diary_content} ${put_diary.members_no}`);
    try{  

        const result = await Mydiary.update(
            req.body,
            { where: { id: diary_no, members_no: members_no}}
        );

        console.log(result);
        msg_result = "일기 수정 완료/n";

    } catch(error) {
        res.send({ success: true, data:put_diary, message: "일기 수정실패", error:error });
        return;
    };

    //일기저장 시 이미지 db저장    
    const files = req.files;
    try{
        if(files){
            console.log(files);
            files.map((image)=>{
                console.log('=====', image);
                const newimage = {diary_no:diary_no, image_path: image.path}
                Gallery.create(newimage);  //이미지 저장
                msg_result += "일기 이미지 저장 완료/n";
            })
        }
    } catch(error){
        res.send({ success: true, message: "추가이미지 db저장실패", error:error });
        return;
    }
    
    res.status(200).send(msg_result);
});

//diary_no로 해당일기 삭제하기 http://{{host}}/mydiaries/1
router.delete('/:diary_no', isAuth, async (req, res)=>{
    const diary_no = req.params.diary_no;
    const members_no = req.mid;
    
    var result = await Gallery.destroy({
        where: { diary_no: diary_no }
    });

    result = await Mydiary.destroy({
        where: { id: diary_no, members_no : members_no }
    });

    console.log(result);
    res.send({ success:true, data:result })
})


// const connectionString = 'DefaultEndpointsProtocol=https;AccountName=stjmy;AccountKey=fkJ3iyquU9RZMY3y/GUvsEA8ovMMahbM4yENe1ZCjgAgbQqfULNGlcBf0Ct+fJ2EOVYg7+QSZDit+AStGZRn+w==;EndpointSuffix=core.windows.net';
// const azureKey = 'fkJ3iyquU9RZMY3y/GUvsEA8ovMMahbM4yENe1ZCjgAgbQqfULNGlcBf0Ct+fJ2EOVYg7+QSZDit+AStGZRn+w==';
// const accountName ='stjmy';

// const getBlobName = (req, file)=>{
//     const ext = path.extname(file.orignalname);
//     return path.basename(file.orignalname, ext) + Date.now() + ext;
// };

// const azureStorage = new MulterAzureStorage({
//     connectionString: connectionString,
//     accessKey: azureKey,
//     accountName: accountName,
//     containerName: 'images',
//     blobName: getBlobName
// });

// const upload = multer ({
//     storage: azureStorage
// });

// app.post('/single', upload.single('image'), (req, res)=>{
//     console.log(req.file);
//     res.send({success:true});
// });









module.exports = router;