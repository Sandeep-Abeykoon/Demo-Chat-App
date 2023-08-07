var express = require('express');
var bodyParser = require('body-parser');


var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');


app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var dbUrl = 'mongodb+srv://sandchanu:12345@cluster0.k0guq7z.mongodb.net/chatApp?retryWrites=true&w=majority'



var Message = mongoose.model('Message', {
    name: String,
    message: String
});



app.get('/messages', (req, res) => {
    Message.find({}).exec()
        .then(messages => {
            res.send(messages);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});



app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save()
    .then(() => {
        io.emit('message', req.body);

        Message.findOne({message: 'badword'}, (err, censored) => {
            if(censored) {
                console.log('censored words found', censored);
                Message.remove({_id: censored.id}, (err) => {
                    console.log('removed censored message')
                })
            }
        });

        res.sendStatus(200);
      })
      .catch(err => {
        sendStatus(500);
      });
});



io.on('connection', (socket) => {
    console.log("a user connected");
});




mongoose.connect(dbUrl)
.then(() => {
    console.log('Successfully connected');
  })
  .catch((err) => {
    throw err;
  });




var server = http.listen(3000, () => {
    console.log("Server is listening on port : ", server.address().port)
});