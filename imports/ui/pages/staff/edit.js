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
    staff: ()=>Meteor.users.findOne(FlowRouter.getParam("staffId")),

});

Template.staffEdit.events({
    //add your events here
});