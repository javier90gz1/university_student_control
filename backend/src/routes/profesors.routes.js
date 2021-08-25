const auth = require('../middleware/auth');
const express = require("express");
const router = express.Router();
const db = require("../models");
const ActivityLog = db.logs;
const Professor = db.profesors;

//get all professor
router.get("/all", auth, (req, res) => {
    Professor.findAll().then(professor => res.json(professor));
})
//get professor by id
router.get("/:id", auth, (req, res) => {
    Professor.findOne({ where: { id: req.params.id } }).then(professor => res.json(professor));
})

//get 10 professor for pagination
router.get("/", auth, (req, res) => {
    var page = Number(req.query.page);
    var per_page = Number(req.query.per_page);
    page = page - 1;
    Professor.count().then((total) => {
        Professor.findAll({
            limit: per_page,
            offset: page * per_page,
            order: [["id", "ASC"]],
        }).then((content) => {
            var result = [];
            content.forEach(function (professor, index, arr) {
                result.push({
                    id: professor.id,
                    name: professor.name,
                    department: professor.department,
                    title: professor.title,
                });
            });

            res.status(200).send({ total: total, data: result });
        });
    });
});
// create a professor
router.post("/", auth, (req, res) => {
    Professor.create(req.body).then(professor => res.json(professor));
});

//delete a professor
router.delete("/:id", auth, (req, res) => {
    Professor.destroy({
        where: {
            id: req.params.id,
        },
    }).then(res.send("Deleted"));
});

//update a professor 
router.put("/", auth, (req, res) => {
    const {
        id,
        name,
        department,
        title
    } = req.body;
    Professor.update(
        {
            name: name,
            department: department,
            title: title,
        },
        {
            where: {
                id: id,
            },
        }
    ).then(res.send("Updated professor with ID " + id));
});


module.exports = router;
