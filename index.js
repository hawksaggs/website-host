const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

var app = express();
// app.set('views', path.join(__dirname+'/public'));
// app.set('view engine', 'html');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public"), { maxAge: 86400000 }));

var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'hawksaggs@gmail.com',
        pass: '10iec014748244@hawks'
    }
};
var smtpTransport = nodemailer.createTransport(smtpConfig);
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/send', function (req, res) {
    var mailOptions = {
        to: 'ayush.mittal@outlook.com',
        subject: 'Enquiry-' + req.body.phone,
        text: 'name - ' + req.body.name + '\n email - ' + req.body.email + '\n phone - ' + req.body.phone + '\n message - ' + req.body.message
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
            res.end("error");
        } else {
            console.log("Message sent: " + response);
            res.end("sent");
        }
    });
});

app.listen(3000, function () {
    console.log('Server is listening on port 3000');
});