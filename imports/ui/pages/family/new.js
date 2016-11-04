import './form'
import "./new.html"
import {Template} from 'meteor/templating'
import {AutoForm} from "meteor/aldeed:autoform"
import {familyStatus} from "/imports/api/family/family-status";
AutoForm.debug();
Template.familyNew.onCreated(function () {
    //add your statement here
});

Template.familyNew.onRendered(function () {
    //add your statement here
});

Template.familyNew.onDestroyed(function () {
    //add your statement here
});

Template.familyNew.helpers({
    familyStatusOptions(){
        return _.map(familyStatus, function (status) {
            return {label: status.label, value: status.id}
        })
    }

});

Template.familyNew.events({
    //add your events here
});