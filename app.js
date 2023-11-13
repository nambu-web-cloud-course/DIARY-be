const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require('cookie-parser');
const sync = require('./models/sync.js');
sync();

const mydiary_router = require('./routes/mydiary_router.js');
const member_router = require('./routes/member_router.js');
const todo_router = require('./routes/todo_router.js');

const port = process.env.PORT || 3000;
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

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

app.listen(port, ()=>{
    console.log(`Server is listening at ${port}`)
});


