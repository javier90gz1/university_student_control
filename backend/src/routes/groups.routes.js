const auth = require('../middleware/auth');
const express = require("express");
const router = express.Router();
const db = require("../models");
const ActivityLog = db.logs;
const Group = db.groups;
const Profesor = db.profesors;
//get all group
router.get("/all", auth, (req, res) => {
    Group.findAll().then(group => res.json(group));
})
//get group by id
router.get("/:id", auth, (req, res) => {
    Group.findOne({
        where: { id: req.params.id },
         include: [
            { model: Profesor, as: 'profesor' }],
    }).then(group => res.json(group));
})

//get 10 group for pagination
router.get("/", auth, (req, res) => {
    var page = Number(req.query.page);
    var per_page = Number(req.query.per_page);
    page = page - 1;
    Group.count().then((total) => {
        Group.findAll({
            limit: per_page,
            offset: page * per_page,
            order: [["id", "ASC"]],
            include: [
                { model: Profesor, as: 'profesor' }],
        }).then((content) => {
            var result = [];
            content.forEach(function (group, index, arr) {
                result.push({
                    id: group.id,
                    name: group.name,
                    profesor: group.profesor
                });
            });

            res.status(200).send({ total: total, data: result });
        });
    });
});
// create a group
router.post("/", auth, (req, res) => {
    Group.create(req.body).then(group => res.json(group));
});

//delete a group
router.delete("/:id", auth, (req, res) => {
    Group.destroy({
        where: {
            id: req.params.id,
        },
    }).then(res.send("Deleted"));
});

//update a group 
router.put("/", auth, (req, res) => {
    const {
        id,
        name,
        profesorId
    } = req.body;
    Group.update(
        {
            name: name,
            profesorId: profesorId,
        },
        {
            where: {
                id: id,
            },
        }
    ).then(res.send("Updated"));
});

module.exports = router;
