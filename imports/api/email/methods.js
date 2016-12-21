/**
 * Created by cesar on 15/11/16.
 */
import {Meteor} from 'meteor/meteor'
import {EmailTemplates} from '/imports/api/email/templates'
import {modifyEmailTemplates} from './server/initial-setup'
import {Families} from "/imports/api/family/family";
import {Groups} from "/imports/api/group/group";
import {check} from "meteor/check";
import {moment} from 'meteor/momentjs:moment'
import htmlToText from 'html-to-text'
import {createTable} from '/imports/api/group/placement/methods'


Meteor.methods({
    templateNew: function (doc) {
        check(doc, EmailTemplates.schema.new)
        if (!Roles.userIsInRole(this.userId, ['admin'])) throw new Meteor.Error('Access denied', 'Only admin can update notes')
        const _id = EmailTemplates.insert(doc)
        return _id
    },
    updateEmailsCampaignReportNote: function (emailId, notes) {
        check (emailId,String)
        check (notes,String)
        if (!Roles.userIsInRole(this.userId, ['admin', 'staff'])) throw new Meteor.Error('Access denied', 'Only admin or staff can update notes')
        return Email.update(emailId, {$set: {notes: notes}})
    },
    emailTemplateUpdate: function (modifier, id) {
        if (!Roles.userIsInRole(this.userId, 'admin')) throw new Meteor.Error('Access denied', 'Only admin can update email templates')
        const res = EmailTemplates.update(id, modifier)
        if (res) {
            if (!_.contains(["enrollAccount", "resetPassword", "verifyEmail", "resetPassword"], id)) return res
            const emailTemplate = EmailTemplates.findOne(id)
            modifyEmailTemplates(emailTemplate)
        }
        return true
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
    sendCampaignCount: function (doc) {
        check(doc, {
            name: String,
            template: String,
            query: Object
        })
        if (!Roles.userIsInRole(this.userId, 'admin')) throw new Meteor.Error('Access denied', 'Only admin can send emails')
        return Families.find(doc.query).count()
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

        const emailTemplate = EmailTemplates.findOne(doc.template)
        if (emailTemplate.campaign == true) {
           let count=0
            families.forEach((user) => {
                const userId = user._id
                const familyId = user._id
                const email = user.emails[0].address
                let enrollAccountUrl = ''
                if (emailTemplate._id == "enrollAccount") {
                    const token = Random.secret();
                    const when = new Date();
                    const tokenRecord = {
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
                    Meteor._ensure(user, 'services', 'password').reset = tokenRecord;
                    enrollAccountUrl = Accounts.urls.enrollAccount(token);
                }
                let confirmedSummary = '', appliedSummary = '', availableSummary = ''


                const firstName = user.firstName ? user.firstName : user.parents && user.parents[0] && user.parents[0].firstName || ''
                const surname = user.surname ? user.surname : user.parents && user.parents[0] && user.parents[0].surname || ''

                let subject = emailTemplate.subject.replace(/<img id="firstName" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, firstName)
                subject = subject.replace(/<img id="surname" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, surname)
                subject = htmlToText.fromString(subject)

                let body = emailTemplate.body.replace(/<img id="firstName" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, firstName)
                if (body.match(/<img id="ConfirmedSummary" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi) || body.match(/<img id="AppliedSummary" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi) || body.match(/<img id="AvailableSummary" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi)) {
                    confirmedSummary = createTable(familyId, 'confirmed')
                    appliedSummary = createTable(familyId, 'applied')
                    availableSummary = createTable(familyId, false)
                }
                body = body.replace(/<img id="surname" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, surname)
                body = body.replace(/<img id="ConfirmedSummary" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, confirmedSummary)
                body = body.replace(/<img id="AppliedSummary" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, appliedSummary)
                body = body.replace(/<img id="AvailableSummary" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, availableSummary)
                body = body.replace(/<img id="url" src="data:image\/png;base64,([A-Za-z0-9\/\+\=]*)">/gi, `<a href="${enrollAccountUrl}">${enrollAccountUrl}</a>`)


                const text = htmlToText.fromString(body)
                const options = {
                    to: email,
                    from: `${emailTemplate.fromName} <${emailTemplate.from}>`,
                    subject: subject,
                    "parent1": user.parents && user.parents[0] && user.parents[0].firstName,
                    "parent2": user.parents && user.parents[1] && user.parents[1].firstName,
                    "surname": user.parents && user.parents[0] && user.parents[0].surname,
                    "mobilePhone": user.parents && user.parents[0] && user.parents[0].mobilePhone,
                    'city': user.contact && user.contact.address && user.contact.address.city,
                    'suburb': user.contact && user.contact.address && user.contact.address.suburb,
                    'campaign': doc.name,
                    "loggedAt": user.loggedAt,
                    "userId": user._id,
                    html: body,
                    text,
                    status: 'sent',
                };
                count++
                if (Meteor.isProduction) {
                    Email.send(options);
                } else {
                    if (count<=3){
                        options.to = 'c@imagenproactiva.com'
                        Email.send(options);
                        console.log('email sent', options.to)
                    }else{
                        console.log('email NO sent (MORE THAN 3)', options.to)
                    }

                }
            })
        }
    },
})


