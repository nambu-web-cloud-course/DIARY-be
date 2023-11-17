const Sequelize = require('sequelize');
//const { now } = require('sequelize/types/utils');

class Mydiaryimgs extends Sequelize.Model{
    static init(sequelize){
        super.init(
            {
                //테이블의 컬럼 정의
                diary_no: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    unique: false
                },
                // saved_diarytitle: {
                //     type:Sequelize.STRING(100),
                //     allowNull:false
                // },
                // saved_diarycontent: {
                //     type: Sequelize.TEXT,
                //     allowNull: false
                // },
                image_path: {
                    type:Sequelize.STRING(1000),
                    allowNull:false
                },
            
            },
            {//테이블 설정
                sequelize,
                timestamps: true,
                underscored: true,
                modelName: 'Mydiaryimgs',
                tableName: 'mydiaryimgs',
                paranoid: true,
                charset: 'utf8',
                collate: 'utf8_general_ci',
            }
        );
    }

    static associate(db){//테이블간 관계 설정
        db.Mydiaryimgs.belongsTo(db.Mydiary, { foreignKey: 'diary_no', sourceKey: 'id' });
    }
}

module.exports = Mydiaryimgs;