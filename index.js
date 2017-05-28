'use strict';

const config = require('./config');
const consolidate = require('consolidate');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');
const session = require('express-session');
const Student = require('./model').Student;
const Admin = require('./model').Admin;
const cookieparser = require('cookie-parser');
const database = require('./database');

const app = express();
const server = app.listen(4000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

// Nexmo init
const nexmo = new Nexmo({
  apiKey: config.api_key,
  apiSecret: config.api_secret,
}, {debug: true});

// socket.io
const io = socketio(server);
io.on('connection', (socket) => {
  console.log('Socket connected');
  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });
});

app.engine('html', consolidate.nunjucks);
app.use(session({ resave: false, saveUninitialized: false, secret: 'secret-cookie' }));
//app.set('views', './views');
// Configure Express
app.use(express.static(__dirname + './views'));
app.set('view engine', 'html');
// app.engine('html', ejs.renderFile);
app.use(express.static('./public'));
app.use('/static', express.static('./static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('./auth'));

var user = function retrieveSignedInUser(req,res,next) {
  req.user = req.session.currentUser;
  next();
};
app.use(user);


//-- Express routes
// route to student form
app.get('/', function(req,res){
  res.render('home.html');
});

app.post('/sendStudent', function(req,res){
  console.log(req.body);

  var fname = req.body.fname;
  var studentno = req.body.studentno;
  var contactno = req.body.contactno;
  var office = req.body.office;

    Student.create({
            fname: fname,
            studentno: studentno,
            contactno: contactno,
            office: office
    }).then(function(){
      // req.flash('statusMsg', 'Successfully reserved a ticket!');
      res.redirect('/');
    });
});

app.get('/login', (req, res) => {
  res.render('signin.html');
});

app.get('/faq', (req, res) => {
  res.render('faq.html');
});

app.get('/admin', requireSignedIn, function(req, res) {
  Admin.findOne({ where: { email: req.user } }).then(function(user) {
    res.render('officeview.html', {
      user: user
    });
  });
});

app.get('/officeview', function(req, res){
  //check who is logged in
  //const getuser

  Student.findAll({ where: {office: "osa-loan"} }).then(function(results){
    res.render('officeview.html', {
      res: results
    });
  });
});

app.post('/serving', function(req, res){
  //check kinsa ang currently gina serve
  Student.min('priorityno').then(function(result){
    console.log(result);
    Student.destroy( {where: {
      priorityno: result}
    }).then(function(){
      res.redirect('/officeview');
    });
  });
  

  console.log(req.body);
  console.log();
});

app.post('/admin', (req, res) => {
  res.send(req.body);

  let toNumber = req.body.number;
  let text = req.body.text;
  console.log(text);
  let data = {}; // the data to be emitted to front-end

  // Sending SMS via Nexmo
  nexmo.message.sendSms(
    config.number, toNumber, text, {type: 'unicode'},
    (err, responseData) => {
      if (err) {
        data = {error: err};
      } else {
        //console.dir(responseData);
        if(responseData.messages[0]['error-text']) {
          data = {error: responseData.messages[0]['error-text']};
        } else {
          let n = responseData.messages[0]['to'].substr(0, responseData.messages[0]['to'].length - 4) + '****';
          data = {id: responseData.messages[0]['message-id'], number: n};
        }
        io.emit('smsStatus', data);
      }
    }
  );

  // Basic Number Insight - get info about the phone number
  nexmo.numberInsight.get({level:'basic', number: toNumber}, (err, responseData) => {
    if (err) console.log(err);
    else {
      console.dir(responseData);
    }
  });

});

function requireSignedIn(req, res, next) {
    if (!req.session.currentUser) {
        return res.redirect('/');
    }
    next();
}