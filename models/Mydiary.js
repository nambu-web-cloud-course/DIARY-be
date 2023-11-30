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
                    allowNull:true
                },
                diary_content: {
                    type: Sequelize.TEXT,
                    allowNull: false
                },
                cate_data_no: {
                    type:Sequelize.INTEGER,
                    allowNull:false
                },
                theme_no: {
                    type: Sequelize.INTEGER,
                    allowNull: true
                },
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
        db.Mydiary.hasMany(db.Gallery, { foreignKey: {name:'diary_no', allowNull:false}, sourceKey: 'id'});
        db.Mydiary.belongsTo(db.Themeimgs, { foreignKey: {name:'theme_no', allowNull:false}, sourceKey: 'id' });
        db.Mydiary.belongsTo(db.Cate_data, { foreignKey: {name:'cate_data_no', allowNull:false}, sourceKey: 'id'});

        // db.Mydiary.hasMany(db.Mydiaryimgs, { foreignKey: {name:'diary_no', allowNull:true}, sourceKey: 'id'});

    }
}

module.exports = Mydiary;