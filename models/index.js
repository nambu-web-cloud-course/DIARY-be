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

db.Member = Member;
db.Mydiary = Mydiary;
db.Todo = Todo;

Member.init(sequelize);
Mydiary.init(sequelize);
Todo.init(sequelize);

Member.associate(db);
Mydiary.associate(db);
Todo.associate(db);

db.sequelize = sequelize;

module.exports = db;
