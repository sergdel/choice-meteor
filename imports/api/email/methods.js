/**
 * Created by cesar on 15/11/16.
 */
import {Meteor} from 'meteor/meteor'
import {EmailTemplates} from '/imports/api/email/templates'
import {modifyEmailTemplates} from './server/initial-setup'
import {Families} from "/imports/api/family/family";
import {check} from "meteor/check";

Meteor.methods({
    updateEmailsCampaignReportNote: function (emailId, notes) {
        if (!Roles.userIsInRole(this.userId, ['admin', 'staff'])) throw new Meteor.Error('Access denied', 'Only admin or staff can update notes')
        console.log(Email.update(emailId, {$set: {notes: notes}}))
    },
    emailTemplateUpdate: function (modifier, id) {
        if (!Roles.userIsInRole(this.userId, 'admin')) throw new Meteor.Error('Access denied', 'Only admin can update email templates')
        const res = EmailTemplates.update(id, modifier)
        if (res) {
            if (!_.contains(["enrollAccount", "resetPassword", "verifyEmail", "resetPassword"], id)) return res
            const emailTemplate = EmailTemplates.findOne(id)
            modifyEmailTemplates(emailTemplate)
        }
    },
    saveCampaign: function (query, tempolate, Id) {

    },
    contact: function (doc) {
        this.unblock()
        let text = ''
        text += doc.name ? `Name: ${doc.name}\n` : ''
        text += doc.email ? `Email: ${doc.email}\n` : ''
        text += doc.phone ? `Phone: ${doc.phone}\n` : ''
        text += doc.suburb ? `Suburb: ${doc.suburb}\n` : ''
        text += doc.school ? `School Drop-off & Pick-up: ${doc.school}\n` : ''
        text += doc.availability ? `Availability: ${doc.availability}\n` : ''
        text += doc.message ? `Message: ${doc.message}\n` : ''
        var options = {
            to: 'emailus@choicehomestay.com',
            from: 'newcontact@choicehomestay.com',
            subject: "New contact from home page",
            "parent1": doc.name,
            'suburb': doc.suburb,
            'campaign': 'website',
            status: 'sent',
            text,
            "h:Reply-To": doc.email
        };
        Email.send(options);
        if (doc.copy) {
            options.from = 'Choice Homestay <emailus@choicehomestay.com>'
            options.to = doc.email
            options.subject = 'Thank you for contacting Choice Homestay'
            Email.send(options);
        }


    },
    sendCampaign: function (doc) {
        check(doc, {
            name: String,
            template: String,
            query: Object
        })
        this.unblock()

        if (!Roles.userIsInRole(this.userId, 'admin')) throw new Meteor.Error('Access denied', 'Only admin can send emails')
        const families = Families.find(doc.query, {fields: {"emails.address": 1, "parents": 1, contact: 1}})


        if (doc.template == "enrollAccount") {
            families.forEach((user) => {
                var userId = user._id
                var email = user.emails[0].address
                var token = Random.secret();
                var when = new Date();
                var tokenRecord = {
                    token: token,
                    email: email,
                    when: when,
                    reason: 'enroll'
                };
                Meteor.users.update(userId, {
                    $set: {
                        "services.password.reset": tokenRecord
                    }
                });

                // before passing to template, update user object with new token
                Meteor._ensure(user, 'services', 'password').reset = tokenRecord;

                var enrollAccountUrl = Accounts.urls.enrollAccount(token);

                var options = {
                    to: email,
                    from: Accounts.emailTemplates.enrollAccount.from
                        ? Accounts.emailTemplates.enrollAccount.from(user)
                        : Accounts.emailTemplates.from,
                    subject: Accounts.emailTemplates.enrollAccount.subject(user),
                    "parent1": user.parents && user.parents[0] && user.parents[0].firstName,
                    "parent2": user.parents && user.parents[1] && user.parents[1].firstName,
                    "surname": user.parents && user.parents[0] && user.parents[0].surname,
                    "mobilePhone": user.parents && user.parents[0] && user.parents[0].mobilePhone,
                    'city': user.contact && user.contact.address && user.contact.address.city,
                    'suburb': user.contact && user.contact.address && user.contact.address.suburb,
                    'campaign': doc.name,
                    "loggedAt": user.loggedAt,
                    "userId": user._id,

                    status: 'sent',
                };

                if (typeof Accounts.emailTemplates.enrollAccount.text === 'function') {
                    options.text =
                        Accounts.emailTemplates.enrollAccount.text(user, enrollAccountUrl);
                }

                if (typeof Accounts.emailTemplates.enrollAccount.html === 'function')
                    options.html =
                        Accounts.emailTemplates.enrollAccount.html(user, enrollAccountUrl);

                if (typeof Accounts.emailTemplates.headers === 'object') {
                    options.headers = Accounts.emailTemplates.headers;
                }
                Email.send(options);


            })
        }

    },

})

