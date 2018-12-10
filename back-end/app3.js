var express = require('express'),
    moment = require('moment'),
    low = require('lowdb'),
    fileSync = require('lowdb/adapters/FileSync');


var router = express.Router();
router.get('/', (req, res) => {
    var ts = 0;
    if (req.query.ts) {
        ts = + req.query.ts;
    }
    var adapter = new fileSync('./db.json');
    var db = low(adapter);

    var inform = db.get('customer').filter(c => c.iat >= ts);
    var drive = db.get('driver');


    var return_ts = moment().unix();
    console.log(inform.size().value());
    res.json({
        drive,
        inform,
        return_ts
    });
});
module.exports = router;