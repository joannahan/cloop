// FOR PERSONAL INFORMATION

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'noreply.cloop@gmail.com',
        pass: 'cloop6.170'
    }
});

var dropboxAppKey = 'heglrwxeonlistw';
var dropboxAppSecret = '6m6vz2ahqi6258x';
var dropboxAccessToken = '5C0K8j7TWRAAAAAAAAAACtZFhpf9ajXcRheGFMPwON9g5Eb_sdCUH7TPHDu3cUlM';

exports.transporter = transporter;
exports.dropboxAppKey = dropboxAppKey;
exports.dropboxAppSecret = dropboxAppSecret;
exports.dropboxAccessToken = dropboxAccessToken;