import './templates/list'
import './templates/edit'
import './reports/reports'
import './campaigns/campaign'
import './emails.html'
import {Template} from 'meteor/templating'

Template.emails.helpers({
    tabs: function () {
        return [
            {id: 'template', title: 'Templates', template:  'emailTemplatesList' },
            {id: 'campaign', title: 'Campaign', template: 'emailsCampaign'},
            {id: 'reports', title: 'Reports', template: 'emailsReports'}
        ]
    },
    template: () => {

    },
    campaign: () => {
        return ''
    }
});

Template.emails.events({
    //add your events here
});

Template.emails.onCreated(function () {
    //add your statement here
});

Template.emails.onRendered(function () {
    //add your statement here
});

Template.emails.onDestroyed(function () {
    //add your statement here
});

