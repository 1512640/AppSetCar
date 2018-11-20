var express = require('express'),
    moment = require('moment'),
    low = require('lowdb'),
    fileSync = require('lowdb/adapters/FileSync');

var adapter = new fileSync('./db.json');
var db = low(adapter);

var router = express.Router();

// router.get('/', (req, res) => {
//     var ts = 0;
//     if (req.query.ts) {
//         ts = +req.query.ts;
//     }

//     var categories = db.get('categories').filter(c => c.iat >= ts);
//     var return_ts = moment().unix();
//     res.json({
//         return_ts,
//         categories
//     });
// })

// router.get('/lp', (req, res) => {
//     var ts = 0;
//     if (req.query.ts) {
//         ts = +req.query.ts;
//     }

//     var loop = 0;
//     var fn = () => {
//         var categories = db.get('categories').filter(c => c.iat >= ts);
//         var return_ts = moment().unix();
//         if (categories.size() > 0) {
//             res.json({
//                 return_ts,
//                 categories
//             });
//         } else {
//             loop++;
//             console.log(`loop: ${loop}`);
//             if (loop < 4) {
//                 setTimeout(fn, 2500);
//             } else {
//                 res.statusCode = 204;
//                 res.end('no data');
//             }
//         }
//     }

//     fn();
// })
// router.get('/resInform', (req, res) => {
//     var ts = 0;
//     if (req.query.ts) {
//         ts = +req.query.ts;
//     }

//     var categories = db.get('customer').filter(c => c.iat >= ts);

//     var return_ts = moment().unix();
//     res.json({
//         return_ts,
//         categories
//     });
// })
router.post('/', (req, res) => {
    
    var stt=db.get('customer')
    .size()
    .value();
    var c = {
        "stt": ++stt,
        "addr": req.body.addr,
        "name": req.body.name,
        "sdt": req.body.sdt,
        "note": req.body.note,
        "state": "chưa được định vị",
        "iat": moment().unix()
    }
    console.log(c);
    db.get('customer').push(c).write();

    res.statusCode = 201;
    res.json({
        msg: 'added'
    });
})

module.exports = router;