const auth = require('../middleware/auth');
const express = require("express");
const router = express.Router();
const db = require("../models");

const Log = db.logs;
const User = db.users;

//get student by id
router.get("/:id", auth, (req, res) => {
    Log.findOne({ where: { id: req.params.id } }).then(log => res.json(log));
})

//get 10 student for pagination
router.get("/", auth, (req, res) => {
    var page = Number(req.query.page);
    var per_page = Number(req.query.per_page);
    page = page - 1;
    Log.count().then((total) => {
        Log.findAll({
            limit: per_page,
            offset: page * per_page,
            order: [["id", "ASC"]],
            include: [
                { model: User, as: 'user' },
            ],
        }).then((content) => {
            var result = [];
            content.forEach(function (log, index, arr) {
                result.push({
                    id: log.id,
                    message: log.message,
                    activityLog: log.activityLog,
                    userId: log.user,
                    createdAt: log.createdAt
                });
            });

            res.status(200).send({ total: total, data: result });
        });
    });
});
// create a student
router.post("/", auth, (req, res) => {
    Log.create(req.body).then(log => res.json(log));
});

//delete a student
router.delete("/:id", auth, (req, res) => {
    Log.destroy({
        where: {
            id: req.params.id,
        },
    }).then(res.send("Deleted"));
});

module.exports = router;
