import {EmailTemplates} from '/imports/api/email-templates/email-templates'
import './list.html'
Template.emailTemplatesList.onCreated(function () {
    //add your statement here
});

Template.emailTemplatesList.onRendered(function () {
    //add your statement here
});
Template.emailTemplatesList.helpers({
    autoTable: EmailTemplates.autoTable
});

Template.emailTemplatesList.events({
    //add your events here
});

Template.emailTemplatesList.onDestroyed(function () {
    //add your statement here
});

