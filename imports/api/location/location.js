/**
 * Created by cesar on 15/12/16.
 */
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {AutoTable} from "meteor/cesarve:auto-table";
import {Mongo} from "meteor/mongo";
import {addressSchema, optsGoogleplace} from '/imports/api/family/contact'

export const Locations = new Mongo.Collection('locations');
export const Distances = new Mongo.Collection('distances');


export const locationSchema = new SimpleSchema({
    name: {
        label: 'Name',
        type: String,
        custom: function () {
            if (Meteor.isClient && this.isSet) {
                Meteor.call("locationExists", this.value, function (error, exists) {
                    if (exists) {
                        locationSchema.namedContext("locationNew").addInvalidKeys([{
                            name: "name",
                            type: "notUnique"
                        }]);
                    }
                });
            }
        }
    },
    address: {
        type: addressSchema,
        optional: true,
        autoform: {
            type: 'googleplace',
            opts: optsGoogleplace
        }
    }
});


export const locationAutoTable = new AutoTable({
    id: 'locationsAutoTable',
    columns: [
        {key: 'name', label: 'Location'},
    ],
    collection: Locations,
    settings: {
        options: {
            columnsSort: true,
            showing: true,
        },
    },
    publish: function () {

        if (!Roles.userIsInRole(this.userId, 'admin')) {
            return false
        }
        return true
    },
    link: function (doc, key) {
        return FlowRouter.path('locationEdit', {locationId: doc._id})
    }
})