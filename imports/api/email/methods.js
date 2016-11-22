/**
 * Created by cesar on 15/11/16.
 */
import {Meteor} from 'meteor/meteor'
import {EmailTemplates} from '/imports/api/email/templates'
import {modifyEmailTemplates} from './server/initial-setup'
import {Families} from "/imports/api/family/family";
import {check} from "meteor/check";

Meteor.methods({
    emailTemplateUpdate: function (modifier, id) {
        if (!Roles.userIsInRole(this.userId, 'admin')) throw new Meteor.Error('Access denied', 'Only admin can update email templates')
        const res = EmailTemplates.update(id, modifier)
        if (res) {
            if (!_.contains(["enrollAccount", "resetPassword", "verifyEmail", "resetPassword"], id)) return res
            console.log('modifyEmailTemplates')
            const emailTemplate = EmailTemplates.findOne(id)
            modifyEmailTemplates(EmailTemplates)
        }
    },
    saveCampaign: function (query, tempolate, Id) {

    },
    contact: function (doc) {
        Meteor._sleepForMs(300 * Meteor.isDeveloment)
        this.unblock()
        const text = `Name: ${doc.name}\nEmail: ${doc.email}\nPhone: ${doc.phone}\nSuburb: ${doc.suburb}\nSchool Drop-off & Pick-up  : ${doc.school}\nAvailability: ${doc.availability}\n\nMessage: ${doc.message}\n`
        var options = {
            to: 'emailus@choicehomestay.com',
            from: 'newcontact@choicehomestay.com',
            subject: "New contact from home page",
            "parent1": doc.name,
            'suburb': doc.suburb,
            'campaign': 'website',
            status: 'sending',
            text,
            "h:Reply-To": doc.email
        };
         Email.send(options);
        options.from='emailus@choicehomestay.com'
        options.subject = 'Thank you for contacting Choice Homestay'
        option.text


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
        if (families.count() > 1) {
            throw new Meteor.Error('hay mas de un email con la cuena de cesar ramos')
        }

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
                    'city': user.contact && user.contact.address && user.contact.address.city,
                    'suburb': user.contact && user.contact.address && user.contact.address.suburb,
                    'campaign': doc.name,
                    "loggedAt": user.loggedAt,
                    "userId": user._id,
                    status: 'sending',
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

    }
})

