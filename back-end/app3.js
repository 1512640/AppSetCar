var express = require('express'),
    moment = require('moment'),
    low = require('lowdb'),
    fileSync = require('lowdb/adapters/FileSync');

var adapter = new fileSync('./db.json');
var db = low(adapter);

var router = express.Router();
router.get('/', (req, res) => {
    var inform = db.get('customer');
    res.json(inform);
});
module.exports = router;