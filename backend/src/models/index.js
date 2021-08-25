const config = require("../config/db.config.js");
//configuration of database
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.students = require("../models/student.model.js")(sequelize, Sequelize);
db.profesors  = require("../models/profesor.model")(sequelize, Sequelize);
db.cities  = require("../models/city.model")(sequelize, Sequelize);
db.groups = require("../models/group.model")(sequelize,Sequelize);
db.users = require("../models/user.model")(sequelize,Sequelize);
db.logs = require("../models/logs.model")(sequelize,Sequelize);
db.roles = require("../models/role.model")(sequelize,Sequelize);

//relation between tables
db.roles.hasOne(db.users);
db.users.belongsTo(db.roles);

db.users.hasOne(db.logs);
db.logs.belongsTo(db.users);

db.cities.hasOne(db.students);
db.students.belongsTo(db.cities);

db.groups.hasOne(db.students);
db.students.belongsTo(db.groups);

db.profesors.hasOne(db.groups);
db.groups.belongsTo(db.profesors);

module.exports = db;