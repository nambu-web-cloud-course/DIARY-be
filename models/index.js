const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const Member = require('./member.js');
const Mydiary = require('./mydiary.js');
const Todo = require('./Todo.js');
const Gallery = require('./Gallery.js');
const Cate_data = require('./cate_data.js');
const Themeimgs = require('./Themeimgs.js');


db.Member = Member;
db.Mydiary = Mydiary;
db.Todo = Todo;
db.Gallery = Gallery;
db.Cate_data = Cate_data;
db.Themeimgs = Themeimgs;


Member.init(sequelize);
Mydiary.init(sequelize);
Todo.init(sequelize);
Gallery.init(sequelize);
Cate_data.init(sequelize);
Themeimgs.init(sequelize);


Member.associate(db);
Mydiary.associate(db);
Todo.associate(db);
Gallery.associate(db);
Cate_data.associate(db);
Themeimgs.associate(db);


db.sequelize = sequelize;

module.exports = db;
