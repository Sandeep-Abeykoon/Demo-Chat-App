var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var mongoose = require('mongoose');
mongoose.Promise = Promise;


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



app.post('/messages', async (req, res) => {

    try {
        var message = new Message(req.body);

        await message.save();
        console.log("saved");

        var censored = await Message.findOne({message: 'badword'})

        if(censored) 
            await Message.deleteOne({_id: censored.id});
        else
            io.emit('message', req.body);
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500);
        return console.error(error);
    } finally {
        console.log('message post called');
    }
})





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