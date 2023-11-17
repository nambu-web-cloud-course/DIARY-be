const Sequelize = require('sequelize');

class Member extends Sequelize.Model{
    static init(sequelize){
        super.init(
            {//테이블의 컬럼 정의:id는 설정하면 안됨(기본으로 설정됨)
                // members_no: {
                //     type: Sequelize.STRING(50),
                //     allowNull: false,
                //     unique: true
                // },
                member_id: {
                    type: Sequelize.STRING(100),
                    allowNull: false
                },
                member_name: {
                    type: Sequelize.STRING(100),
                    allowNull: false
                },
                password: {
                    type: Sequelize.STRING(100),
                    allowNull: false
                }
            },
            {//테이블 설정
                sequelize,
                timestamps: true,
                underscored: true,
                modelName: 'Member',
                tableName: 'members',
                paranoid: true,
                charset: 'utf8',
                collate: 'utf8_general_ci'
            }
        );
    }

    static associate(db){ //테이블간 관계 설정
        db.Member.hasMany(db.Mydiary, { foreignKey: 'members_no', sourceKey: 'id'});
        db.Member.hasMany(db.Todo, { foreignKey:{name:'members_no', allowNull:false}, sourceKey: 'id'});
        // db.Member.hasMany(db.Gallery, { foreignKey:{name:'members_no', allowNull:false}, sourceKey: 'id'});
        // db.Member.hasMany(db.Gallery, { foreignKey:{name:'diary_no', allowNull:false}, sourceKey: 'id'});
    }
};

module.exports = Member;