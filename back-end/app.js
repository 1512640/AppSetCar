var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    cors = require('cors');

var app1Ctrl = require('./app1');
var app2Ctrl = require('./app2');
var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json({
	type:'application/json' }));
app.use(cors());

app.use('/sendInform', app1Ctrl);
app.use('/resInform',app2Ctrl);
var PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API running on PORT ${PORT}`);
});