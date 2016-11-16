/**
 * Created by cesar on 15/11/16.
 */
import {Meteor} from 'meteor/meteor'
import {EmailTemplates} from '/imports/api/email-templates/email-templates'
import {modifyEmailTemplates} from './server/initial-setup'
Meteor.methods({
    emailTemplateUpdate: function (modifier, id) {
        if (!Roles.userIsInRole(this.userId, 'admin')) throw new Meteor.Error('Access denied', 'Only admin can update email templates')
        const res = EmailTemplates.update(id, modifier)
        if (res) {
            if (!_.contains(["enrollAccount", "resetPassword", "verifyEmail", "resetPassword"], id)) return res
            console.log('updated email template ')
            const emailTemplate = EmailTemplates.findOne(id)
            modifyEmailTemplates(EmailTemplates)
        }
    }
})

