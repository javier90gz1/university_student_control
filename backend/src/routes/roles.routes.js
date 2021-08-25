const auth = require('../middleware/auth');
const express = require("express");
const router = express.Router();
const db = require("../models");
const { roles } = require('../models');

const Role = db.roles;
//get all role 
router.get("/:id", auth, (req, res) => {
    Role.findAll().then(role => res.json(role));
})
//get role by id
router.get("/:id", auth, (req, res) => {
    Role.findOne({ where: { id: req.params.id } }).then(role => res.json(role));
})

//get 10 role for pagination
router.get("/", auth, (req, res) => {
    var page = Number(req.query.page);
    var per_page = Number(req.query.per_page);
    page = page - 1;
    Role.count().then((total) => {
        Role.findAll({
            limit: per_page,
            offset: page * per_page,
            order: [["id", "ASC"]],
        }).then((content) => {
            var result = [];
            content.forEach(function (role, index, arr) {
                result.push({
                    id: role.id,
                    name: role.name,
                });
            });
            res.status(200).send({ total: total, data: result });
        });
    });
});
// create a role
router.post("/", auth, (req, res) => {
    Role.create(req.body).then(role => res.json(role));
});

//delete a role
router.delete("/:id", auth, (req, res) => {
    Role.destroy({
        where: {
            id: req.params.id,
        },
    }).then(res.send("Deleted"));
});

//update a role 
router.put("/", auth, (req, res) => {
    const {
        id,
        name,
    } = req.body;
    Role.update(
        {
            name: name,
        },
        {
            where: {
                id: id,
            },
        }
    ).then(res.send("Updated"));
});

module.exports = router;
