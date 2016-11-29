/**
 * Created by cesar on 15/11/16.
 */
Email = new Mongo.Collection('emails')
Email.send = function (options) {
    options.sentAt = new Date()
    const emailId = Email.insert(options)
    console.log('email send ****** emailId', emailId)
    options["v:my-custom-data"] = emailId
    options["o:tracking"]="yes"
    options["o:tracking-opens"]="yes"
    options["o:tracking-clicks"]="yes"
    var api_key = Meteor.settings && Meteor.settings.mailgun && Meteor.settings.mailgun.api_key
    if (!api_key){
        console.error('mailgun.messages theres is no api key')
        return emailId
    }

    var domain = Meteor.settings.mailgun.domain
    var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
    mailgun.messages().send(options, function (error, body) {
        if (error){
            console.error('mailgun.messages',error,options)
        }

    });

}
