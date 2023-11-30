
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
const getmonth_router = require('./routes/getmonth_router.js');
const cate_data_router = require('./routes/cate_data_router.js');
const themeimgs_router = require('./routes/themeimgs_router.js');
// const mydiaryimgs_router = require('./routes/gallery_router.js');


const port = process.env.PORT || 8080;
const app = express();

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
app.use('/getmonth', getmonth_router);
app.use('/cate_data', cate_data_router);
app.use('/themeimgs', themeimgs_router);
// app.use('/mydiaryimgs', mydiaryimgs_router);

// // path 불러오는 코드 추가!
// const path = require("path");

// // production mode
// if(process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));

//   app.get("*", (req, res) => {
//     // path는 여기에서만 사용되었다.
//     res.sendFile(path.join(__dirname, "../client/build/index.html"))
//   })
// }

app.listen(port, ()=>{
    console.log(`Server is listening at ${port}`)
});


