var express = require('express');

var app = express();

app.use(express.static(__dirname));

var messages = [
    {name: "Tim", message: "Hi"},
    {name: "Sandeep", message: "Happy birthday"}
];

app.get('/messages', (req, res) => {
    res.send(messages)
});

var server = app.listen(3000, () => {
    console.log("Server is listening on port : ", server.address().port)
});