const Sequelize = require('sequelize');

class Gallery extends Sequelize.Model{
    static init(sequelize){
        super.init(
            { 
                //테이블의 컬럼 정의
                diary_no: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    unique: false
                },
                image_path: {
                    type:Sequelize.STRING(1000),
                    allowNull:false
                },
            },
            {//테이블 설정
                sequelize,
                timestamps: true,
                underscored: true,
                modelName: 'Gallery',
                tableName: 'gallery',
                paranoid: true,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            }
        );
    }

    static associate(db){//테이블간 관계 설정
        db.Gallery.belongsTo(db.Mydiary, { foreignKey: {name:'diary_no', allowNull:false}, sourceKey: 'id' });
        // db.Gallery.belongsTo(db.Member, { foreignKey: {name:'members_no', allowNull:false}, sourceKey: 'id' });
        // db.Gallery.belongsTo(db.Member, { foreignKey: {name:'diary_no', allowNull:false}, sourceKey: 'id' });
        
    }
}

module.exports = Gallery;