const { sequelize } = require('./index.js'); //index.js는 생략가능
const sync = () => {
    sequelize
        .sync({ force: false })
        .then(()=>{
            console.log('데이터베이스 생성완료')
        })
        .catch((err)=>{
            console.error(err);
        });
}

module.exports = sync;