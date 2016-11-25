import "./table.html"
import "./list.html"
import {Template} from "meteor/templating"
import {FlowRouter} from "meteor/kadira:flow-router"
import {Groups} from "/imports/api/group/group"
import {moment} from 'meteor/momentjs:moment'

Template.groupList.onCreated(function () {

});
Template.groupList.onRendered(function () {

});

Template.groupList.onDestroyed(function () {
    //add your statement here
});


Template.groupList.helpers({
    autoTableStaff: Groups.autoTableStaff,
    autoTableFamilyAvailable: Groups.autoTableFamilyAvailable,
    autoTableFamilyApplied: Groups.autoTableFamilyApplied,
    customQueryAvailable: {"familiesApplying.familyId": {$ne: Meteor.userId()}},
    customQueryApplied: {"familiesApplying.familyId": {$eq: Meteor.userId()}},
});
Template.bsModalPrompt.events({
    'click .groupCancelApply'(e, instance){
        console.log('groupCancelApply')
        Meteor.call('groupCancelApply', $(e.currentTarget).data('group-id'), function (err, res) {
            console.log(err, res)
            BootstrapModalPrompt.hide()
        })
    },
})
Template.groupList.events({

    'click .applyGroup'(e, instance){
        console.log('click .applyGroup', instance)
        const groupApply = _.findWhere(this.familiesApplying, {familyId: Meteor.userId()})
        const content =  (this.requirements || ' ') + (this.requirements && this.other ? ' <br>' : '') + (this.other || ' ')
        const cancelButton= groupApply ? '<button class="btn btn-danger btn-xs groupCancelApply" data-group-id="'+this._id+'">Cancel application <i class="fa fa-trash"></i></button>' : ''
        BootstrapModalPrompt.prompt({
            attachTo: instance.firstNode,
            title: "Apply for a group",
            content: content,
            content1: cancelButton,
            autoform: {
                schema: Groups.schemas.apply,
                type: "normal",
                doc: groupApply,
                id: 'applyGroup',
                buttonContent: false,
                omitFields: ['familyId']
            },
            btnDismissText: 'Cancel',
            btnOkText: 'Save'
        }, (data) => {
            if (data) {
                console.log('click applyGroup', this, data)
                Meteor.call('groupApply', this._id, data, function (err, res) {
                    console.log(err, res)
                })
            }
            else {

            }
        });


    },
    'click .groupNew'(e, instance){
        Groups.attachSchema(Groups.schemas.new, {replace: true})
        BootstrapModalPrompt.prompt({
            title: "New Group",
            autoform: {
                collection: Groups,
                schema: Groups.schemas.new,
                type: "method",
                "meteormethod": "groupNew",
                id: 'groupNew',
                buttonContent: false,
            },
            btnDismissText: 'Cancel',
            btnOkText: 'Save'
        }, function (data) {
            if (data) {
                console.log(data)
                FlowRouter.go('groupEdit', {groupId: data})
            }
            else {
                console.log('cancel')
            }
        });
    },

});

