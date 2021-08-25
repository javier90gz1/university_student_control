//import requirements
const express = require('express');
const bodyParser = require("body-parser")
const cors = require('cors');
const app = express();
const db = require("./src/models");
const port = process.env.PORT;
const path = require('path'); 
const Role = db.roles
const User  =db.users;


var bcrypt = require("bcryptjs");


db.sequelize.sync().then(()=>{
  initial();
});
/*db.sequelize.sync({ force: true }).then(() => {
  console.log('Drop and Resync Db');
  initial();
});*/

function initial() {
  Role.findOne().then(res=>{
    if(res===null){
      Role.create({
        id: 1,
        name: "user"
      });
    
      Role.create({
        id: 2,
        name: "admin"
      });
    }
  })
  User.findOne().then(res=>{
    if(res === null){
      User.create({
        "user_name":"admin",
        "email":"admin@admin.com",
        "password": bcrypt.hashSync(process.env.ADMIN_PASSWORD, 8),  
        "complete_name":"Javier gonzalez",
        "email":"admin@gmail.com",
      "roleId":2});
    }
  })
}

  
//insert dependencies
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

//routes of api
const cities = require('./src/routes/cities.routes');
const groups = require('./src/routes/groups.routes');
const login = require('./src/routes/login.routes');
const logs = require('./src/routes/logs.routes');
const professors = require('./src/routes/profesors.routes');
const roles = require('./src/routes/roles.routes');
const students = require('./src/routes/students.routes');
const users = require('./src/routes/users.routes');

//use of routes
app.use('/api/cities', cities);
app.use('/api/groups', groups);
app.use('/api/login', login);
app.use('/api/logs', logs);
app.use('/api/professors', professors);
app.use('/api/roles', roles);
app.use('/api/students', students);
app.use('/api/users', users);

//start server 
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})