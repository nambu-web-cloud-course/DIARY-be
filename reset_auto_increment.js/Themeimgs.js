const { Themeimgs, Mydiary } = require('../models');
const { Member } = require('../models');
const { Cate_data } = require('../models');
const { Gallery } = require('../models');
const { Mydiary } = require('../models');
const { Todo } = require('../models');

//기존 디비에 있는 테이블을 drop한 후에 재실행 시 적용
// AUTO_INCREMENT 값을 초기화하는 함수
async function resetAutoIncrement() {
  try {
    // 특정 테이블의 AUTO_INCREMENT 값을 초기화하는 SQL 쿼리
    const query = `ALTER TABLE Themeimgs AUTO_INCREMENT = 1;`;

    // Sequelize.query를 사용하여 쿼리 실행
    await sequelize.query(query);

    console.log('AUTO_INCREMENT reset successful');
  } catch (error) {
    console.error('Error resetting AUTO_INCREMENT:', error);
  } finally {
    // Sequelize 연결 종료
    await sequelize.close();
  }
}

// 초기화 함수 호출
resetAutoIncrement();
