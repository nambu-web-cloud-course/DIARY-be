const express = require('express');
const router = express.Router();
const isAuth = require('./authorization.js');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { Mydiary, Gallery, Member } = require('../models/index.js');
const { Op, DATE } = require('sequelize');
dotenv.config();
const port = process.env.PORT || 8080;
let gallery = [];
const utils = require('./utils.js');

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
    
    console.log('members_no', members_no, 'params', params);

    if(members_no && params){ 
        // const bDate = '2023-11-27 00:00:00';
        // const eDate = '2023-12-01 00:00:00';

        const result = await Gallery.findAll({
            attributes: ['id','diary_no', 'image_path', 'created_at', 'updated_at'],
            where: {
                created_at : {
                    [Op.and]: {
                    // [Op.gte]: beginDate, // 이상
                    // [Op.lte]: endDate, // 이하
                    [Op.gte]: params.StartDate, // 이상
                    [Op.lte]: params.EndDate, // 이하
                    }
                }, 
            },
            order: [['id',  params.OrderBy]],
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

    console.log('gallery_no', gallery_no);

    // 에저 파일 삭제 처리
    if(gallery_no){ 
        const result = await Gallery.findAll({
            attributes: ['id', 'image_path', 'created_at', 'updated_at'],
            order: [['id', 'desc']],
            where: { id: gallery_no },
        });
        console.log({ success:true, data:result[0]?.image_path });
        

        if(result[0]?.image_path) {
            // 이미지 경로가 있을 경우 블랍 파일 삭제 트라이
            // res.send({ success:true, data:result });

            // 경로를 '/'로 나누어 배열로 변환
            const pathArray = result[0]?.image_path.split('/');

            // 배열에서 마지막 요소, 즉 마지막 파일명 가져오기
            const lastFileName = pathArray[pathArray.length - 1];


            // 권한 인증 오류로 기능 보류
            // deleteBlob(lastFileName);
        }
    } else { //query로 id 입력하지 않았을때 전체목록
        console.log({ success:true, data:"none" });
    };

    // var result = "";
    var result = await Gallery.destroy({
        where: { id: gallery_no }
    });

    console.log(result);
    res.send({ success:true, data:result })
});


// npm install @azure/storage-blob
const { BlobServiceClient } = require('@azure/storage-blob');
const { StorageSharedKeyCredential } = require('@azure/storage-blob');
const connection = process.env.AZURE_STORAGE_CONNECTION;
const azureKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const containerName = 'images';

const deleteBlob = async (blobName) => {
    // Azure Storage BlobServiceClient 생성
    const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net`,
        new StorageSharedKeyCredential(accountName, azureKey)
    );

    // Blob 컨테이너 및 Blob 클라이언트 생성
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Blob 삭제
    try {
        await blockBlobClient.delete();
        console.log('Blob deleted successfully');
    } catch (error) {
        console.error('Error deleting blob', error);
    }
};

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