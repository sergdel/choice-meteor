import './update-status.html'
import './apply'
import {Template} from 'meteor/templating'
import {EmailTemplates} from '/imports/api/email/templates'
import {Groups} from '/imports/api/group/group'

Template.groupUpdateStatus.onCreated(function () {
    if (!EmailTemplates.findOne('ConfirmFamily') || EmailTemplates.findOne('UnconfirmationFamily') || EmailTemplates.findOne('CancelFamily')) {
        this.subscribe('EmailTemplate', 'ConfirmFamily')
        this.subscribe('EmailTemplate', 'UnconfirmationFamily')
        this.subscribe('EmailTemplate', 'CancelFamily')
    }
    this.subscribe('EmailTemplates');

});

Template.groupUpdateStatus.onRendered(function () {
});

Template.groupUpdateStatus.onDestroyed(function () {
    //add your statement here
});

Template.groupUpdateStatus.helpers({
    applied: () => {
        const template = Template.instance()
        return template.data && template.data.groups && template.data.groups[0].status == 'applied'
    },
    confirm: () => {
        const template = Template.instance()
        return template.data && template.data.groups && template.data.groups[0].status == 'confirmed'
    },
    potential: () => {
        const template = Template.instance()
        return !template.data || !template.data.groups || !template.data.groups[0] || !template.data.groups[0].status
    },
});

Template.groupUpdateStatus.events({
    'click .updateStatus'(e, instance){
        const groupId = FlowRouter.getParam('groupId')
        const status = $(e.currentTarget).data('status')
        let templateId
        switch (status) {
            case 'confirmed':
                templateId = 'ConfirmFamily'
                break
            case 'applied':
                templateId = 'UnconfirmationFamily'
                break
            case 'canceled':
                templateId = 'CancelFamily'
                break
            default:
                return
        }
        const doc = EmailTemplates.findOne({"_id":templateId})
        BootstrapModalPrompt.prompt({
            title: doc.description,
            autoform: {
                schema: EmailTemplates.schema.autoformGroupUpdateStatus,
                doc: doc,
                type: "normal",
                id: 'confirmationEmailTemplate',
                buttonContent: false,
                omitFields: ['_id', 'buttons']
            },
            btnDismissText: 'Cancel',
            btnOkText: 'Save and send email'
        }, (emailTemplate) => {
            if (emailTemplate) {
                Meteor.call('groupUpdateStatus', groupId, this._id, status, emailTemplate)
            }
            else {
            }
        });


    }
});
