var express = require('express');
var cardRepo = require('../repos/cardRepo');
var transfer = require('../db/opts').TRANSFER;
var nodemailer = require('nodemailer');
var moment = require('moment');
var genOtp = require('otp-generator');

var router = express.Router();

// add card
router.post('/', (req, res) => {
    var user = req.token_payload.user;
    cardRepo.addCard(user.Id)
        .then(insertId => {
            res.statusCode = 201;
            res.json(req.body);
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end();
        });
});

// get all card
router.get('/me', (req, res) => {
    var uid = req.token_payload.user.Id;
    cardRepo.cardByUser(uid).then(cards => {
        res.statusCode = 200;
        res.json(cards);
    }).catch(err => {
        console.log(err);
        res.statusCode = 500;
        res.end();
    });
});

// close card
router.post('/close', (req, res) => {
    var cardId = req.body.cardId;
    cardRepo.closeCard(cardId).then(cards => {
        res.statusCode = 200;
        res.json(cards);
    }).catch(err => {
        console.log(err);
        res.statusCode = 500;
        res.end();
    });
});

router.post('/otp', (req, res) => {
    
});

router.post('/transfer', (req, res) => {
    var srcId = req.body.srcId;
    var desId = req.body.desId;

    var money = +req.body.money;

    var sCard = cardRepo.load(srcId);
    var dCard = cardRepo.load(desId);

    var feeForSrc = req.body.feeForSrc;

    Promise.all([sCard, dCard]).then(([srcCard, desCard]) => {
        var realFee = parseInt(transfer.fee*money / 100);
        if (realFee > transfer.max) {
            realFee = transfer.max;
        } 
        if (realFee < transfer.min) {
            realFee = transfer.min;
        }

        var recieverMoney = feeForSrc ? money : money - realFee;
        var senderMoney = feeForSrc ? money + realFee : money;
        var updateDesCard = cardRepo.updateMoney(desCard[0].Id, desCard[0].Money + recieverMoney);
        var updateSrcCard = cardRepo.updateMoney(srcCard[0].Id, srcCard[0].Money - senderMoney);
        Promise.all([updateSrcCard, updateDesCard]).then(([idSrc, idDes]) => {
            res.statusCode = 200;
            res.json({
                'src': idSrc,
                'des': idDes
            });
        }).catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end();
        });
    }).catch(err => {
        console.log(err);
        res.statusCode = 500;
        res.end();
    });
});

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "minhanpro123@gmail.com",
        pass: "anhyeuem1997?"
    }
});

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
// nodemailer.createTestAccount((err, account) => {
//     // setup email data with unicode symbols
//     let mailOptions = {
//         to: 'anleminh97@gmail.com', // list of receivers
//         subject: 'Hello ✔', // Subject line
//         text: 'Hello world?', // plain text body
//         html: '<b>Hello world?</b>' // html body
//     };

//     // send mail with defined transport object
//     smtpTransport.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             return console.log(error);
//         }
//         console.log('Message sent: %s', info.messageId);
//     });
// });

module.exports = router;