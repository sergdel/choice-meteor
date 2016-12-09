/**
 * Created by cesar on 15/11/16.
 */

import htmlToText from 'html-to-text'
import {Email} from 'meteor/email'


export const modifyEmailTemplates = function (emailTemplate) {
    if (_.contains(["enrollAccount", "resetPassword", "verifyEmail", "resetPassword"], emailTemplate._id)) {
        Accounts.emailTemplates[emailTemplate._id].subject = function (user) {
            return emailTemplate.subject
        };
        Accounts.emailTemplates[emailTemplate._id].html = function (user, url) {
            let body = ''
            const firstName = user.firstName ? user.firstName : user.parents && user.parents[0] && user.parents[0].firstName || ''
            const surname = user.surname ? user.surname : user.parents && user.parents[0] && user.parents[0].surname || ''
            body = emailTemplate.body.replace(/<img id="firstName" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, firstName)
            body = body.replace(/<img id="surname" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, surname)
            body = body.replace(/<img id="url" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, `<a href="${url}">${url}</a>`)
            return body

        };
        Accounts.emailTemplates[emailTemplate._id].text = function (user, url) {
            return htmlToText.fromString(Accounts.emailTemplates[emailTemplate._id].html(user, url))
        };
        Accounts.emailTemplates[emailTemplate._id].from = function () {
            return `${emailTemplate.fromName} <${emailTemplate.from}>`;
        };
    } else {
    }

}

//todo look for efficet way to do this
// the problem is the list of campaign To be reactive and for sort

Accounts.onLogin(function (log) {
    const userId = log.user._id
    Email.update({userId}, {$set: {loggedAt: new Date()}}, {multi: true})

})
