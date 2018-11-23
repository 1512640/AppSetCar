var express = require('express'),
    moment = require('moment'),
    low = require('lowdb'),
    fileSync = require('lowdb/adapters/FileSync');

var adapter = new fileSync('./db.json');
var db = low(adapter);

var router = express.Router();

router.post('/registration', (req, res) => {
    
    var stt=db.get('account')
    .size()
    .value();
    var c = {
        "stt": ++stt,
        "name": req.body.name,
        "pass": req.body.pass,
        "iat": moment().unix()
    }
    db.get('account').push(c).write();

    res.statusCode = 201;
    res.json({
        msg: 'added'
    });
})
router.post('/signIn', (req, res) => {
	var temp = null;
	var name1 = req.body.name;
	var temp = db.get('account').filter(c => c.name === req.body.name);
	
	if (temp != [] ) {
		res.statusCode = 201;
		res.json({
			temp,
			msg: 'Sign in success'			
		});
	} else {
		res.statusCode = 400;
		res.json({
			temp,
			msg: 'Sign in failed'
			
		});
	}
})
module.exports = router;