const Sequelize = require('sequelize');

class Cate_data extends Sequelize.Model{
    static init(sequelize){
        super.init(
            {//테이블의 컬럼 정의
                cate_data: {
                    type:Sequelize.JSON,
                    allowNull: false
                }
            },
            {//테이블 설정
                sequelize,
                timestamps: true,
                underscored: true,
                modelName: 'Cate_data',
                tableName: 'cate_data',
                paranoid: true,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            }
        );
    }

    static associate(db){//테이블간 관계 설정
        // db.Cate_data.belongsTo(db.Mydiary, { foreignKey: {name:'id', allowNull:false}, sourceKey: 'id' });
    }
}

module.exports = Cate_data;