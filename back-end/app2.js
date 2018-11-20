var express = require('express'),
    moment = require('moment'),
    low = require('lowdb'),
    fileSync = require('lowdb/adapters/FileSync');

// var adapter = new fileSync('./db.json');
// var db = low(adapter);

var router = express.Router();

router.get('/', (req, res) => {
    var ts = 0;
    if (req.query.ts) {
        ts = +req.query.ts;
    }
    var adapter = new fileSync('./db.json');
    var db = low(adapter);
    for (var i=0;i<db.get('customer').size().value();i++)
    {
        db.get('customer')
        .find({ stt: i+1 })
        .assign({ state: 'đã định vị'})
        .write()
    }
    var categories = db.get('customer').filter(c => c.iat >= ts);

    var return_ts = moment().unix();
    res.json({
        return_ts,
        categories
    });
})


module.exports = router;