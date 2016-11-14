import "./table.html"
import "./list.html"
import "./search-form"
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
    autoTable: Groups.autoTable
});

Template.groupList.events({
    'click apply'(e, instance){
        Meteor.call('groupApply', function (err, res) {
            console.log(err, res)
        })
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

