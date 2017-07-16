var express = require('express');
var path = require('path');
var app = express();

app.use(express.static(path.join(__dirname, './')));

app.get('/', function(req, res) {

});
app.post('/', function(req, res) {
    res.send({status: 5, text: 'сервер принял запрос'})
});


app.listen(3000, function(){
    console.log('Listen on port: 3000...');
});