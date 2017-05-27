'use strict';

const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');
const Student = require('./database').Student;

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

// Configure Express
app.use(express.static(__dirname + './views'));
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
  var purpose = req.body.purpose;

    Student.create({
            fname: fname,
            studentno: studentno,
            contactno: contactno,
            office: office,
            purpose : purpose
    }).then(function(){
      // req.flash('statusMsg', 'Successfully reserved a ticket!');
      res.redirect('/');
    });
});

app.get('/admin', (req, res) => {
  res.render('index.html');
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