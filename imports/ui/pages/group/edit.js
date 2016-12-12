import "./edit.html"
import {Template} from "meteor/templating";
import {Groups} from "/imports/api/group/group";
import '/imports/ui/componets/autoform/readonly/readonly'
Template.groupEdit.onCreated(function () {
    console.log('Template.groupEdit.onCreated', this)

});

Template.groupEdit.onRendered(function () {
    console.log('Template.groupEdit.onRendered', this)
});

Template.groupEdit.onDestroyed(function () {
    //add your statement here
});

Template.groupEdit.helpers({
    collection: ()=> {
        Groups.attachSchema(Groups.schemas.new, {replace: true})
        Groups.attachSchema(Groups.schemas.edit)
        return Groups
    },

})
;

Template.groupEdit.events({
    'click .groupRemove'(e, instance) {
        BootstrapModalPrompt.prompt({
            title: 'Please confirm',
            content: 'Are you sure to remove this Group?<br>This action can not be undo.',
            btnDismissTextClass: 'btn-default',
            btnOkTextClass: 'btn-danger',
            btnDismissText: 'Cancel',
            btnOkText: 'Yes, I\'m sure.',
        }, (data) => {
            if (data) {
                Meteor.call('groupRemove', this._id)
                FlowRouter.go('groupList')
            } else {

            }
        })
    },
});


