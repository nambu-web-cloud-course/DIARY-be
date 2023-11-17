const Sequelize = require('sequelize');

class Themeimgs extends Sequelize.Model{
    static init(sequelize){
        super.init(
            {//테이블의 컬럼 정의
                themeimg_title: {
                    type:Sequelize.STRING(100),
                    allowNull:true
                },
                themeimg_path: {
                    type:Sequelize.STRING(200),
                    allowNull: false
                }
            },
            {//테이블 설정
                sequelize,
                timestamps: true,
                underscored: true,
                modelName: 'Themeimgs',
                tableName: 'themeimgs',
                paranoid: true,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            }
        );
    }

    static associate(db){//테이블간 관계 설정
        db.Themeimgs.belongsTo(db.Mydiary, { foreignKey: {name:'diary_no', allowNull:false}, sourceKey: 'id' });
    }
}

module.exports = Themeimgs;