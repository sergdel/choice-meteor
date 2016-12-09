import './form'
import "./edit.html"

import {Template} from 'meteor/templating'
import {AutoForm} from "meteor/aldeed:autoform"
import {FlowRouter} from "meteor/kadira:flow-router"
AutoForm.debug();

Template.staffEdit.onCreated(function () {
   this.subscribe('staff',FlowRouter.getParam("staffId"))
});

Template.staffEdit.onRendered(function () {
});

Template.staffEdit.onDestroyed(function () {
    //add your statement here
});

Template.staffEdit.helpers({
    ami: ()=> FlowRouter.getParam("staffId")==Meteor.userId(),
    staff: ()=>Meteor.users.findOne(FlowRouter.getParam("staffId")),

});

Template.staffEdit.events({
    'click .remove'(e,instance){
        BootstrapModalPrompt.prompt({
            title: "Please confirm",
            content: 'Are you sure to remove this staff, this acction can not be undo',
            btnDismissText: 'Cancel',
            btnOkText: 'Yes, remove it',
            btnOkTextClass: 'btn-danger'
        }, function (data) {
            if (data) {
                Meteor.call('staffRemove', FlowRouter.getParam("staffId"), function (err, res) {
                    if (!err)
                        FlowRouter.go('staffList')
                })
            }
            else {
            }
        });
    }

});