import './list.html'
import {Template}  from 'meteor/templating'
import {Locations} from '/imports/api/location/location'
import {locationAutoTable} from "/imports/api/location/location";
import {locationSchema} from "/imports/api/location/location";

Template.locationList.helpers({
    locationAutoTable:locationAutoTable,


});

Template.locationList.events({
    'click .locationNew'(e, instance){
        BootstrapModalPrompt.prompt({
            title: "New Lcation",
            autoform: {
                schema: locationSchema,
                type: "method",
                meteormethod: "locationNew",
                id: 'locationNew',
                buttonContent: false,
                omitFields: ['address'],
            },
            btnDismissText: 'Cancel',
            btnOkText: 'Save'
        }, function (data) {
            if (data) {
                FlowRouter.go('locationEdit', {locationId: data})
            }
            else {
            }
        });
    },
});

Template.locationList.onCreated(function () {
    //add your statement here
});

Template.locationList.onRendered(function () {
    //add your statement here
});

Template.locationList.onDestroyed(function () {
    //add your statement here
});

