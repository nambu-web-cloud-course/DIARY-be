const Sequelize = require('sequelize');
//const { now } = require('sequelize/types/utils');

class Mydiary extends Sequelize.Model{
    static init(sequelize){
        super.init(
            {
                //테이블의 컬럼 정의
                // members_no: {
                //     type: Sequelize.INTEGER,
                //     allowNull: false,
                //     unique: false
                // },
                diary_title: {
                    type:Sequelize.STRING(100),
                    allowNull:false
                },
                diary_content: {
                    type: Sequelize.STRING(1000),
                    allowNull: false
                },
                cate_data: {
                    type:Sequelize.STRING(50)
                }
            },
            {//테이블 설정
                sequelize,
                timestamps: true,
                underscored: true,
                modelName: 'Mydiary',
                tableName: 'mydiaries',
                paranoid: true,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            }
        );
    }

    static associate(db){//테이블간 관계 설정
        db.Mydiary.belongsTo(db.Member, { foreignKey: 'members_no', sourceKey: 'id' });
    }
}

module.exports = Mydiary;