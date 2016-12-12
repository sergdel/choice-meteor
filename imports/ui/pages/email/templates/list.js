import {EmailTemplates}  from "/imports/api/email/templates"
import {ReactiveVar}  from "meteor/reactive-var"
import './list.html'



Template.emailTemplatesList.onCreated(function () {
    this.id = new ReactiveVar(false)

});

Template.emailTemplatesList.onRendered(function () {
    //add your statement here
});
Template.emailTemplatesList.helpers({
    id: () => Template.instance().id.get(),
    autoTable: EmailTemplates.autoTable,

});

Template.emailTemplatesList.events({
    'click .templateNew'(e,instance){
        BootstrapModalPrompt.prompt({
            title: "New template",
            autoform: {
                schema: EmailTemplates.schema.new,
                type: "method",
                meteormethod: "templateNew",
                id: 'templateNew',
                buttonContent: false,
            },
            btnDismissText: 'Cancel',
            btnOkText: 'Save'
        }, function (data) {
            if (data) {
                instance.id.set(data)
            }
            else {
            }
        });
    },
    'click a.td'(e, instance){
        instance.id.set(this._id)
    },
    'click .back'(e,instance){
        instance.id.set(false)
    }
});

Template.emailTemplatesList.onDestroyed(function () {
    //add your statement here
});

