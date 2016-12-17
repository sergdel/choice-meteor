import './edit.html'
import {Template} from 'meteor/templating'
import {Locations,locationSchema} from '/imports/api/location/location'
import {FlowRouter} from 'meteor/kadira:flow-router'

Template.locationEdit.helpers({
    locationSchema: locationSchema,
    doc: ()=>Locations.findOne(FlowRouter.getParam('locationId'))
});

Template.locationEdit.events({
    //add your events here
});

Template.locationEdit.onCreated(function () {
    //add your statement here
});

Template.locationEdit.onRendered(function () {
    this.subscribe('location',FlowRouter.getParam('locationId'))
});

Template.locationEdit.onDestroyed(function () {
    //add your statement here
});

