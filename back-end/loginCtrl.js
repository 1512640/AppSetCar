var express = require('express'),
    moment = require('moment'),
    low = require('lowdb'),
    fileSync = require('lowdb/adapters/FileSync');

var adapter = new fileSync('./db.json');
var db = low(adapter);

var router = express.Router();

router.post('/registration', (req, res) => {
    
    var stt=db.get('driver')
    .size()
    .value();
    var c = {
        "stt": ++stt,
        "name": req.body.name,
        "pass": req.body.pass,
        "state":" Ready",
        "addr":" cập nhật",
        "iat": moment().unix()
    }
    db.get('account').push(c).write();

    res.statusCode = 201;
    res.json({
        msg: 'added'
    });
})
router.get('/signIn', (req, res) => {
	var temp ;
	var i=0
	var name1 = req.query.name;
	console.log(" name:"+ name1)
	//var temp = db.get('driver').filter(c => c.name === req.body.name );
	console.log("kich thuosc:"+ db.get('driver').size().value())
	for(i; i < db.get('driver').size().value();i++)
	{	
		console.log(i)
		if(db.get('driver')
        .find({ stt: i+1 }).get('name').value() ===req.query.name && db.get('driver')
        .find({ stt: i+1 }).get('pass').value() ===req.query.pass ){
			res.statusCode = 201;
        temp=db.get('driver').find({ stt: i+1 }).value();
        //temp = db.get('driver').filter(c => c.stt ===1+1).;
        console.log(temp);
		res.json({
			temp,
			msg: 'Sign in success'			
		});
		
		break;
		}
        
	
	} 
	console.log("thoat vong lap")
	console.log(i)
	if( i === db.get('driver').size().value()){
		res.statusCode = 202;
		res.json({
			
			msg: 'Sign in failed'
			
		});
	}
	
})
module.exports = router;