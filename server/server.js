require('./config/config');

var bodyParser = require('body-parser');
var express = require('express');

var port = process.env.PORT;
var app = express();

app.use(bodyParser.json());

app.use(require('./routes/user'));

app.use(require('./routes/error-handler'));

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
