var bodyParser = require('body-parser');
var express = require('express');

var {env} = require('./config/config');
var port = process.env.PORT;
var app = express();

app.use(bodyParser.json());

app.use(require('./routes/user'));

app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  // how to use res.locals?!
  res.locals.message = err.message;
  res.locals.error = env === 'development' ? err : {};

  res.status(err.status || 500);
  res.send(err);
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
