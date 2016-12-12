import './update-status.html'
import {Template} from 'meteor/templating'
import {EmailTemplates} from '/imports/api/email/templates'
import {Groups} from '/imports/api/group/group'

Template.groupUpdateStatus.onCreated(function () {
    if (!EmailTemplates.findOne('ConfirmFamily') ||   EmailTemplates.findOne('UnconfirmationFamily')){
        this.subscribe('EmailTemplate', 'ConfirmFamily')
        this.subscribe('EmailTemplate', 'UnconfirmationFamily')
    }

});

Template.groupUpdateStatus.onRendered(function () {
});

Template.groupUpdateStatus.onDestroyed(function () {
    //add your statement here
});

Template.groupUpdateStatus.helpers({});

Template.groupUpdateStatus.events({
    'click .confirmFamily'(e, instance){
        const groupId=FlowRouter.getParam('groupId')

        if (instance.data.groups[0].status == 'applied') {
            templateId='ConfirmFamily'
        }
        if (instance.data.groups[0].status == 'confirmed') {
            templateId= 'UnconfirmationFamily'
        }
        const doc = EmailTemplates.findOne(templateId)
        BootstrapModalPrompt.prompt({
            title: "Confirmation Email",
            autoform: {
                schema: EmailTemplates.schema.autoformGroupUpdateStatus,
                doc: doc,
                type: "normal",
                id: 'confirmationEmailTemplate',
                buttonContent: false,
                omitFields: ['_id','buttons']
            },
            btnDismissText: 'Cancel',
            btnOkText: 'Save and send email'
        },  (data)=> {
            if (data) {
                Meteor.call('groupUpdateStatus', groupId, this._id, data)
            }
            else {
            }
        });


    }
});
