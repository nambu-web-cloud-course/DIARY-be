const Sequelize = require('sequelize');

class Themeimgs extends Sequelize.Model{
    static init(sequelize){
        super.init(
            {              
                //모델의 속성 정의
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                //테이블의 컬럼 정의
                themeimg_title: {
                    type:Sequelize.STRING(100),
                    allowNull:true
                },
                themeimg_path: {
                    type:Sequelize.STRING(1000),
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
        // db.Themeimgs.hasMany(db.Mydiary, { foreignKey: {name:'theme_no', allowNull:true}, sourceKey: 'id'});
     }
}

module.exports = Themeimgs;