// FOR PERSONAL INFORMATION

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'noreply.cloop@gmail.com',
        pass: 'cloop6.170'
    }
});

exports.transporter = transporter;