import './update-status.html'
import {Template} from 'meteor/templating'

Template.groupUpdateStatus.onCreated(function () {
});

Template.groupUpdateStatus.onRendered(function () {
});

Template.groupUpdateStatus.onDestroyed(function () {
    //add your statement here
});

Template.groupUpdateStatus.helpers({
   'click .groupUpdateStatus'(e,instance){
       Meteor.call('groupUpdateStatus',FlowRouter.getParam('groupId'),this._id)
   }
});

Template.groupUpdateStatus.events({
    //add your events here
});
