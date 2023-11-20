// const fs = require('fs');
// const path = require('path');
// const multer = require('multer');
// const MulterAzureStorage = require('multer-azure-blob-storage').MulterAzureStorage

const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const sync = require('./models/sync.js');
sync();

const mydiary_router = require('./routes/mydiary_router.js');
const member_router = require('./routes/member_router.js');
const todo_router = require('./routes/todo_router.js');
const gallery_router = require('./routes/gallery_router.js');
const cate_data_router = require('./routes/cate_data_router.js');
const themeimgs_router = require('./routes/themeimgs_router.js');
// const mydiaryimgs_router = require('./routes/gallery_router.js');

const port = process.env.PORT || 8080;
const app = express();
//-----------------------------------------------------------

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
//-----------------------------------------------

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors());//모든 포트 접근 허용
app.use(express.urlencoded({extended:true}))

app.get('/', (req, res)=>{
    if(req.cookies.id){
        console.log(req.cookies);
    } else {
        res.cookie('id', 'diary', {
            maxAge: 1000000,
            httpOnly: true,
        } );
    }
    res.send('Hello Cookies!');
});

app.use('/members', member_router);
app.use('/mydiaries', mydiary_router);
app.use('/todos', todo_router);
app.use('/gallery', gallery_router);
app.use('/cate_data', cate_data_router);
app.use('/themeimgs', themeimgs_router);
// app.use('/mydiaryimgs', mydiaryimgs_router);


app.listen(port, ()=>{
    console.log(`Server is listening at ${port}`)
});


