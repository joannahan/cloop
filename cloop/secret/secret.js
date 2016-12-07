// FOR PERSONAL INFORMATION

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'noreply.cloop@gmail.com',
        pass: 'cloop6.170'
    }
});

var dropboxAppKey = '5ojr5l278rnp99e';
var dropboxAppSecret = 'bwrx748px1kxt6e';
var dropboxAccessToken = 'q09Gg_TpHiQAAAAAAAAAD4LiGv_6dMJ4JcyGxW1mYShGZsctunbrEpKJl1H52FoQ';

exports.transporter = transporter;
exports.dropboxAppKey = dropboxAppKey;
exports.dropboxAppSecret = dropboxAppSecret;
exports.dropboxAccessToken = dropboxAccessToken;