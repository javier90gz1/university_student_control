const auth = require('../middleware/auth');
const express = require("express");
const router = express.Router();
const db = require("../models");
const bcrypt = require('bcryptjs');

const User = db.users;
const Role = db.roles;
//get all user
router.get("/all", auth, (req, res) => {
    User.findAll().then(user => res.json(user));
})
//get user by id
router.get("/:id", auth, (req, res) => {
    User.findOne({
        where: {
            id: req.params.id,
        },
        include: [
            { model: Role, as: 'role' }
        ],
    }).then(user => res.json(user));
})
//get all user_name
router.get("/user_name", auth, (req, res) => {
    const user_name = String(req.query.user_name);
    User.findOne({ where: { user_name: user_name } }).then(user => res.json(user));
})

//get 10 user for pagination
router.get("/", auth, (req, res) => {
    var page = Number(req.query.page);
    var per_page = Number(req.query.per_page);
    page = page - 1;
    User.count().then((total) => {
        User.findAll({
            limit: per_page,
            offset: page * per_page,
            order: [["id", "ASC"]],
            include: [
                { model: Role, as: 'role' }
            ],
        }).then((content) => {
            var result = [];
            content.forEach(function (user, index, arr) {
                result.push({
                    id: user.id,
                    user_name: user.user_name,
                    email: user.email,
                    password: user.password,
                    full_name: user.full_name,
                    roleId: user.role,
                    last_login_date: user.last_login_date,
                });
            });

            res.status(200).send({ total: total, data: result });
        });
    });
});
// create a user
router.post("/", auth, (req, res) => {
    let user = {
        full_name: req.body.full_name,
        user_name: req.body.user_name,
        email: req.body.email,
        roleId: req.body.roleId,
        password:bcrypt.hashSync(req.body.password, 8),
    }
    User.create(req.body
    ).then(user => res.json(user));
});

//delete a user
router.delete("/:id", auth, (req, res) => {
    User.destroy({
        where: {
            id: req.params.id,
        },
    }).then(res.send("Deleted"));
});

//update a user
router.put("/", auth, (req, res) => {
    const {
        id,
        user_name,
        email,
        full_name,
        roleId,
    } = req.body;
    let password = null
    if (req.body.passsword !== undefined)
        password = req.body.passsword
    if (password !== null)
        User.update(
            {
                user_name: user_name,
                email: email,
                full_name: full_name,
                roleId: roleId,
                passsword: bcrypt.hashSync(password, 8)
            },
            {
                where: {
                    id: id,
                },
            }
        ).then(res.send("Updated"));
    else
        User.update(
            {
                user_name: user_name,
                email: email,
                full_name: full_name,
                roleId: roleId,
            },
            {
                where: {
                    id: id,
                },
            }
        ).then(res.send("Updated"));
});


module.exports = router;
