const auth = require('../middleware/auth');
const express = require("express");
const router = express.Router();
const db = require("../models");

const City = db.cities;
//get all city 
router.get("/all", auth, (req, res) => {
    City.findAll().then(city => res.json(city));
})
//get city by id
router.get("/:id", auth, (req, res) => {
    City.findOne({ where: { id: req.params.id } }).then(city => res.json(city));
})

//get 10 city for pagination
router.get("/", auth, (req, res) => {
    var page = Number(req.query.page);
    var per_page = Number(req.query.per_page);
    page = page - 1;
    City.count().then((total) => {
        City.findAll({
            limit: per_page,
            offset: page * per_page,
            order: [["id", "ASC"]],
        }).then((content) => {
            var result = [];
            content.forEach(function (city, index, arr) {
                result.push({
                    id: city.id,
                    name: city.name,
                });
            });

            res.status(200).send({ total: total, data: result });
        });
    });
});
// create a city
router.post("/", auth, (req, res) => {
    City.create(req.body).then(city => res.json(city));
});

//delete a city
router.delete("/:id", auth, (req, res) => {
    City.destroy({
        where: {
            id: req.params.id,
        },
    }).then(res.send("Deleted"));
});

//update a city 
router.put("/", auth, (req, res) => {
    const {
        id,
        name,
    } = req.body;
    City.update(
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
