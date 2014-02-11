var express = require('express');
var routes = require('./routes');
var remind = require('./routes/remind.js');
var confirm = require('./routes/confirm.js');
var http = require('http');
var path = require('path');
var app = express();


// all environments

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: 'fdsfdsfdsfsfsdkmfkwemkmmmmmmkmkMKMK$KMKMRMMKMKXMKMXKMXKX'}));
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public/web')));

app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


// function authenticate(req, res, next) {
//   if (!req.session || !req.session.user) {
//     if (req.url == '/login') {
//       next();
//     } else {
//       res.redirect('/login');
//       }
//     }
//   else {
//   next();
//   }
// }

// app.get('/', authenticate);
app.get('/views/addrecipient.html', function(req, res) {
  res.redirect('/#/views/addrecipient.html');
})

app.post('/login/success', function(req, res) {
  req.session.user = req.body.email;
  res.redirect('/#/dashboard');
});

app.get('/logout', function(req, res) {
  req.session.user = null;
  res.redirect('/login');
});

app.get('/api/remind', function(req, res) {
  res.redirect('#/')
});

// app.post('/api/createtemplate', remind.createtemplate);
app.post('/api/createreminder', remind.createreminder);

app.post('/api/addrecipient', remind.addrecipients);

app.get('/login', routes.login);


// app.get('/api/sendreminder:id', remind.sendreminder);

app.get('/confirm/:id', confirm.index);
app.get('/cancel/:id', confirm.cancel);

// app.get('/api/findtemplate', remind.findtemplate);

app.get('/api/findrecipients', remind.findrecipients);

app.get('/api/findreminders', remind.findreminders);

app.delete('/api/deletereminder/:id', remind.deletereminder);

app.post('/api/sendreminder/:id', remind.sendreminder); 




http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
