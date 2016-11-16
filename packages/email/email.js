/**
 * Created by cesar on 15/11/16.
 */
Email={
    send:function(options){
        var api_key = Meteor.settings.mailgun.api_key
        var domain = Meteor.settings.mailgun.domain
        var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
        mailgun.messages().send(options, function (error, body) {
            console.log(error,body);
        });

    }
}