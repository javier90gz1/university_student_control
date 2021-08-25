const express = require('express');
const router = express.Router();
const db = require("../models");
const config = require("../config/auth.js");
const User = db.users;
const Role = db.roles;
const ActivityLog = db.logs;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

router.post('/', (req, res) => {
    User.findOne({
        where: {
            user_name: req.body.user_name
        },
        include: [
            { model: Role, as: 'role' }
        ],
    }).then(user => {
        if (!user) {
            return res.status(404).send({ message: "Usuario no encontrado." });
        }

        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Contraseña inválida!"
            });
        }

        var token = jwt.sign({
            id: user.id, 
        }, config.secret, {
            expiresIn: 86400 // 24 hours
        });
        ActivityLog.create({ message: `Ha accedido al sistema`, userId: user.id, activityLog: 'ACCESS' });
        User.update(
            {
                last_login_date: new Date()
            },
            {
                where: {
                    id: user.id,
                },
            }
        )
        res.status(200).send({
            id: user.id,
            username: user.user_name,
            full_name: user.full_name,
            roles: ("ROLE_" + user.role.name).toUpperCase(),
            accessToken: token
        });
    })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
});
module.exports = router;