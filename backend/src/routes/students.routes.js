const auth = require('../middleware/auth');
const express = require("express");
const router = express.Router();
const db = require("../models");

const Students = db.students;
const Group = db.groups;
const City = db.cities;

//get student by id
router.get("/:id", auth, (req, res) => {
    Students.findOne({ where: { id: req.params.id },  include: [
        { model: Group, as: 'group' }, { model: City, as: 'city' }
    ], }).then(student => res.json(student));
})

//get 10 student for pagination
router.get("/", auth, (req, res) => {
    var page = Number(req.query.page);
    var per_page = Number(req.query.per_page);
    page = page - 1;
    Students.count().then((total) => {
        Students.findAll({
            limit: per_page,
            offset: page * per_page,
            order: [["id", "ASC"]],
            include: [
                { model: Group, as: 'group' }, { model: City, as: 'city' }
            ],
        }).then((content) => {
            var result = [];
            content.forEach(function (student, index, arr) {
                result.push({
                    id: student.id,
                    age: student.age,
                    sex: student.sex,
                    name: student.name,
                    email:student.email,
                    last_name:student.last_name,
                    born_date: student.born_date,
                    city: student.city,
                    group: student.group
                });
            });

            res.status(200).send({ total: total, data: result });
        });
    });
});
// create a student
router.post("/", auth, (req, res) => {
    Students.create(req.body).then(student => res.json(student));
});

//delete a student
router.delete("/:id", auth, (req, res) => {
    Students.destroy({
        where: {
            id: req.params.id,
        },
    }).then(res.send("Deleted"));
});

//update a student 
router.put("/", auth, (req, res) => {
    const {
        id,
        age,
        sex,
        name,
        last_name,
        born_date,
        city,
        group
    } = req.body;
    Students.update(
        {
            age: age,
            sex: sex,
            name: name,
            last_name: last_name,
            born_date: born_date,
            city: city,
            group: group,
        },
        {
            where: {
                id: id,
            },
        }
    ).then(res.send("Updated"));
});


module.exports = router;
