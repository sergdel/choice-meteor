/**
 * Created by cesar on 14/11/16.
 */
import {EmailTemplates} from '/imports/api/email/templates'

Meteor.publish('EmailTemplate', function (EmailTemplateId) {
    if (!Roles.userIsInRole(this.userId, 'admin')) return this.ready()
    return EmailTemplates.find(EmailTemplateId)
})
