const express = require('express');
const app = express();

app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + '/app'));
app.use(express.static(__dirname + '/asset'));

app.get('/', function (req, res) {
  res.sendfile('index.html', {root: './app'});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
