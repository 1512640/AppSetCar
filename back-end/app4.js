var express = require('express'),
    moment = require('moment'),
    low = require('lowdb'),
    fileSync = require('lowdb/adapters/FileSync');

var adapter = new fileSync('./db.json');
var db = low(adapter);

var router = express.Router();

router.post('/setAdd',(req,res) =>{
	var add=req.data;
	var i=req.query.stt;
	db.get('driver').find({stt:i}).assign({ add: add}).write();
	res.json({
		msg:" post Addr success"
	})
})	

router.get('/setStatus', (req, res) => {
	
	var trangthai;
	var temp;

	var user = req.query.user;
	var i=parseFloat(user);
	trangthai = req.query.stt;
	console.log(" Tinh Trang:"+ trangthai + " số thứu tự "+ i);

	//var temp = db.get('driver').filter(c => c.name === req.body.name );
	console.log("kich thuosc:"+ db.get('driver').size().value());
	db.get('driver').find({stt:i}).assign({ status: trangthai}).write();
    //temp = db.get('driver').filter(c => c.stt === user ).value();
    temp=db.get('driver').find({ stt: i}).value();
    //temp=db.get('driver').find({ stt: i+1 }).value();
    console.log(temp);
        res.json({
			temp,
			msg: 'Sign in success'			
		});
	
	
});
router.get('/', (req, res) => {
    var ts = 0;

    
   if (req.query.ts) {
        ts = +req.query.ts;			
    }
    var adapter = new fileSync('./db.json');
    var db = low(adapter);
    
    var categories = db.get('customer').filter(c => (c.state ==="đã định vị" && c.iat >= ts)); 	//kiem tra da dinh vi chưa
    var return_ts;
    if(categories.size().value()===0){
    return_ts = ts;
}
else{
	return_ts = moment().unix();
}
    res.json({
        return_ts,
        categories
    });
});
router.get('/setClient', (req, res) => { ////chỉnh sửa thông tin khi driver chấp nhận đón khách
    var vitri = 0;
    vitri=+req.query.stt;
    var adapter = new fileSync('./db.json');
    var db = low(adapter);
    console.log(db.get('customer').find({ stt: vitri}).get('state').value());
    if(db.get('customer').find({ stt: vitri}).get('state').value()!== "đã định vị"){
    	res.statusCode = 202;
    res.json({
        msg:"accept Fail"
    });
    }
    else{
    statusCode= 200;
    
    
    db.get('customer')
        .find({ stt: vitri })
        .assign({ state: req.query.state})
        .write();
    
    
    res.json({
        msg:"accept success"
    });
	};

});
module.exports = router;