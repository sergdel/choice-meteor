/**
 * Created by cesar on 14/11/16.
 */
import {EmailTemplates} from '/imports/api/email/templates'

Meteor.publish('EmailTemplate', function (EmailTemplateId) {
    if (!Roles.userIsInRole(this.userId, ['admin', 'staff'])) return this.ready()
    return EmailTemplates.find(EmailTemplateId)
})
Meteor.publish('EmailTemplates', function () {
    if (!Roles.userIsInRole(this.userId, ['admin', 'staff'])) return this.ready()
    return EmailTemplates.find({})
})
