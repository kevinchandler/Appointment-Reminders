var express = require('express');
var routes = require('./routes');
var remind = require('./routes/remind.js');
var confirm = require('./routes/confirm.js');
var http = require('http');
var path = require('path');
var app = express();


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public/web')));
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.post('/api/re-mind/createtemplate', remind.createtemplate);
app.post('/api/re-mind/createreminder', remind.createreminder);
app.post('/api/re-mind/addrecipients', remind.addrecipients);

app.get('/api/remind', function(req, res) {
	res.redirect('#/')
});

// app.get('/api/sendreminder:id', remind.sendreminder);

//to implement this view later for the recipient's confirmation
app.get('/confirm/:id', confirm.index);

app.get('/api/re-mind/findtemplate', remind.findtemplate);

app.get('/api/re-mind/findrecipients', remind.findrecipients);

app.get('/api/re-mind/findreminders', remind.findreminders);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
