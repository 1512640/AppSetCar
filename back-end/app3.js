var express = require('express'),
    moment = require('moment'),
    low = require('lowdb'),
    fileSync = require('lowdb/adapters/FileSync');

var adapter = new fileSync('./db.json');
var db = low(adapter);

var router = express.Router();
router.get('/', (req, res) => {
    var ts = 0;
    //if (req.query.ts) {
    //    ts = + req.query.ts;
    //}
    var inform = db.get('customer');
    var return_ts = moment().unix();
    console.log(inform);
    res.json({
        inform,
        return_ts
    });
});
module.exports = router;