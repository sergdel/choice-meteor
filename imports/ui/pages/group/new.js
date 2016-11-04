import './form'
import "./new.html"
import {Template} from 'meteor/templating'
import {AutoForm} from "meteor/aldeed:autoform"
import {groupStatus} from "/imports/api/group/group-status";
AutoForm.debug();
Template.groupNew.onCreated(function () {
    //add your statement here
});

Template.groupNew.onRendered(function () {
    //add your statement here
});

Template.groupNew.onDestroyed(function () {
    //add your statement here
});

Template.groupNew.helpers({
    groupStatusOptions(){
        return _.map(groupStatus, function (status) {
            return {label: status.label, value: status.id}
        })
    }

});

Template.groupNew.events({
    //add your events here
});