/**
 * Created by cesar on 15/11/16.
 */
Email = new Mongo.Collection('emails')
Email.deny({
    insert:()=>true,
    update:()=>true,
    remove:()=>true,
})
Email.allow({
    insert:()=>false,
    update:()=>false,
    remove:()=>false,
})
Meteor.startup(()=>console.log("Meteor.absoluteUrl()",Meteor.absoluteUrl()))
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
        console.error('Email no sent: there is no mail gun api key')
        return emailId
    }

    if (Meteor.isDevelopment || Meteor.absoluteUrl()=='http://dev.choicehomestay.com.au/'){
        const currentUser=Meteor.user()
        let to
        if (currentUser){
            to=currentUser.emails[0].address
        }else{
            to='c@imagenproactiva.com'
        }
        console.log('original '+ options.to + ' email sent to ', to)
        options.to=to
    }
    var domain = Meteor.settings.mailgun.domain
    var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
    mailgun.messages().send(options, function (error, body) {
        if (error){
            console.error('mailgun.messages',error,options)
        }

    });
}
