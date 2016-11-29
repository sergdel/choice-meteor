/**
 * Created by cesar on 17/11/16.
 */
import {Email} from 'meteor/email'
var bodyParser = require('body-parser')
// necessary for Collection use and other wrapped methods
var Fiber = Npm.require('fibers');


WebApp.connectHandlers.use(bodyParser.urlencoded({extended: true}))  // these two replace
    .use(bodyParser.json())        // the old bodyParser
    .use("/mailgun", function (req, res, next) {
        //todo for security verify the token for insurance the info comes from mail gun, I don't think is import o a real problem but if we got the time i a good idea
        const emailId = req.body && req.body['my-custom-data'] || req.query['my-custom-data']
        const status = req.body && req.body.event
        console.log('mailgun webhook **********************',emailId,status)

        if (emailId) {
            Fiber(function () {
                Email.update(emailId, {$set: {status: status, last: new Date()}, $addToSet: {events: status}})
            }).run()
        }
        res.writeHead(200);
        res.end('ready');


    });

/*
 2016-11-17 18:40:32+10:00{ : '{"emailId":"anK7a2CSnBxAzJmEf"}',
 c8r2
 2016-11-17 18:40:32+10:00 city: 'Mountain View',
 c8r2
 2016-11-17 18:40:32+10:00 domain: 'choicehomestay.com',
 c8r2
 2016-11-17 18:40:32+10:00 'device-type': 'desktop',
 c8r2
 2016-11-17 18:40:32+10:00 'client-type': 'browser',
 c8r2
 2016-11-17 18:40:32+10:00 h: '5c6292d974a92135f1d486dfc2bc2d82',
 c8r2
 2016-11-17 18:40:32+10:00 region: 'CA',
 c8r2
 2016-11-17 18:40:32+10:00 'client-name': 'Firefox',
 c8r2
 2016-11-17 18:40:32+10:00 'user-agent': 'Mozilla/5.0 (Windows NT 5.1; rv:11.0) Gecko Firefox/11.0 (via ggpht.com GoogleImageProxy)',
 c8r2
 2016-11-17 18:40:32+10:00 country: 'US',
 c8r2
 2016-11-17 18:40:32+10:00 'client-os': 'Windows',
 c8r2
 2016-11-17 18:40:32+10:00 ip: '66.249.84.202',
 c8r2
 2016-11-17 18:40:32+10:00 'message-id': '20161117083840.12001.8459.7D39AEFE@choicehomestay.com',
 c8r2
 2016-11-17 18:40:32+10:00 recipient: 'cesar@imagenproactiva.com',
 c8r2
 2016-11-17 18:40:32+10:00 event: 'opened',
 c8r2
 2016-11-17 18:40:32+10:00 timestamp: '1479372032',
 c8r2
 2016-11-17 18:40:32+10:00 token: 'c40b0733769854b9843f3ceff2982bba1b0b867fed37ed683e',
 c8r2
 2016-11-17 18:40:32+10:00 signature: '1820d53b5ac6f077181f286179da202457133b70d456cb5bb4088c0169fca1d5',
 c8r2
 2016-11-17 18:40:32+10:00 'body-plain': '' } {}
 */