var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(express.static(__dirname));
app.use(bodyParser.json());


var messages = [
    {name: "Tim", message: "Hi"},
    {name: "Sandeep", message: "Happy birthday"}
];

app.get('/messages', (req, res) => {
    res.send(messages);
});

app.post('/messages', (req, res) => {
    messages.push(req.body);
    res.sendStatus(200);
});

var server = app.listen(3000, () => {
    console.log("Server is listening on port : ", server.address().port)
});