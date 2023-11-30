const express = require('express');
const router = express.Router();
const isAuth = require('./authorization.js');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'production';
const config = require(__dirname + '/../config/config.json')[env];


let sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);


// 월별 일기, Todo 일자 가져오기
router.get('/', isAuth, async (req, res)=>{
    const members_no = req.mid
    // console.log('members_no:', members_no);

    const params = req.query;
    console.log('withDiary members_no', members_no, 'params', params);

    if(members_no) {
        if( params ){ //query로 검색 조건값 입력 시 

            try {
                // UNION을 위한 SQL 쿼리 작성
                const unionQuery = `
                    SELECT 'todos' as data_type, DATE_FORMAT(todo_date, "%Y.%m.%d") AS created_date
                    FROM todos 
                    WHERE deleted_at is null 
                        and members_no = :members_no
                        and todo_date between :StartDate and :EndDate
                    UNION
                    SELECT 'mydiaries' as data_type, DATE_FORMAT(created_at, "%Y.%m.%d") AS created_date
                    FROM mydiaries 
                    WHERE deleted_at is null 
                        and members_no = :members_no
                        and created_at between :StartDate and :EndDate
                `;
                // const unionQuery = `
                // SELECT DISTINCT(BASE.created_date) AS distinctValue
                // FROM (
                //     SELECT DATE_FORMAT(created_at, "%Y.%m.%d") AS created_date
                //     FROM todos 
                //     WHERE deleted_at is null 
                //         and members_no = :members_no
                //         and created_at between :StartDate and :EndDate
                //     UNION
                //     SELECT DATE_FORMAT(created_at, "%Y.%m.%d") AS created_date
                //     FROM mydiaries 
                //     WHERE deleted_at is null 
                //         and members_no = :members_no
                //         and created_at between :StartDate and :EndDate
                // ) AS BASE
                // `;

                // Sequelize에서 직접 SQL 쿼리 실행
                const result = await sequelize.query(unionQuery, {
                    replacements: { members_no: members_no, StartDate : params.StartDate, EndDate : params.EndDate },
                    type: Sequelize.QueryTypes.SELECT,
                    raw: true, // 결과를 plain object로 반환
                });

                // 결과 출력
                console.log(result);

                res.send({ success:true, data:result });
            } catch (error) {
                console.error('Error:', error);
                res.send({ success: true, message: "할일 가져오기실패", error});
            }
        } 
    }  else { //query로 id 입력하지 않았을때 전체목록
        res.send({ success: true, message: "할일 가져오기실패"});
    };
});

module.exports = router;