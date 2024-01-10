var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var user = require('../model/user.js');
var cors = require('cors');
var validator = require('validator');
var morgan = require('morgan');
var fs = require('fs');
var path = require('path');
var rfs = require('rotating-file-stream');
var uuid = require('node-uuid')
//var validateFn=require('../validation/validationFns');

app.options('*', cors());
app.use(cors());
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// Get the parent directory of the controller directory
var parentDir = path.resolve(__dirname, '..');

// Create a rotating write stream with a 12-hour rotation interval
var accessLogStream = rfs.createStream('log.txt', {
  interval: '12h', // rotate every 12 hours
  path: path.join(parentDir, 'log.txt') 
});

app.use(assignId)
app.use(morgan(':id :method :url :response-time'))

morgan.token('id', function getId (req) {
    return req.id
})

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })

// app.use(morgan('combined'));
// app.use(morgan(':method :url :date'));
// app.use(morgan(':method :url :status :remote-addr :date[format])', { stream: accessLogStream }));
app.use(morgan(':method :url :status :remote-addr :date[format])', { stream: accessLogStream }));

app.get('/', function (req, res) {
    res.send('Saved!')}
)

function assignId (req, res, next) {
    req.id = uuid.v4()
    next()
}

app.use(bodyParser.json());
app.use(urlencodedParser);

app.get('/user/:userid', function (req, res) {
    var id = req.params.userid;

    user.getUser(id, function (err, result) {
        if (!err) {
            //validateFn.sanitizeResult(result);
            res.send(result);
        } else {

            res.status(500).send("Some error");
        }
    });
});



app.get('/user', function (req, res) {

    user.getUsers(function (err, result) {
       
        if (!err) {
            //validateFn.sanitizeResult(result);
            res.send(result);
        } else {
            res.status(500).send(null);
        }
    });
});


//POST (INSERT) /user
app.post('/user', function (req, res) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var role = "member";//req.body.role;

    user.insertUser(username, email, role, password, function (err, result) {

        res.type('json');
        if (err) {
            res.status(500);
            res.send(`{"message":"Internal Server Error"}`);

        } else {
            res.status(200);
            res.send(`{"Record Inserted":"${result.affectedRows}"}`);
        }
    });

});


app.delete('/user/:userid', function (req, res) {

    var userid = req.params.userid;

    user.deleteUser(userid, function (err, result) {

        res.type('json');
        if (err) {
            res.status(500);
            res.send(`{"message":"Internal Server Error"}`);

        } else {
            res.status(200);
            res.send(`{"Record(s) Deleted":"${result.affectedRows}"}`);
        }

    });

});
module.exports = app;