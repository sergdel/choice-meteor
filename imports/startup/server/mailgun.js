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
        if (emailId) {
            Fiber(function () {
                Email.update(emailId, {$set: {status: status, last: new Date()}, $addToSet: {events: status}})
            }).run()
        }
        res.writeHead(200);
        res.end('ready');


    });
