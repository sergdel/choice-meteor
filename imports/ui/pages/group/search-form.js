/**
 * Created by cesar on 30/9/16.
 */
import './search-form.html'
import {groupStatus} from "/imports/api/group/group-status";
import {optsGoogleplace} from "/imports/api/group/contact";
import '/imports/ui/componets/autoform/select-multi-checkbox-combo/select-multi-checkbox-combo'
import '/imports/ui/pages/group/export'
AutoForm.hooks({
    searchGroupListForm: {
        onSubmit: function (search, modifier,) {
            if (search.address && search.address.geometry) {
                Session.setPersistent('searchGroupListForm.address', search.address);
                Session.setPersistent('searchGroupListForm.orderBy', {})
            } else {
                Session.setPersistent('searchGroupListForm.address', null)
            }
            Session.setPersistent('searchGroupListForm.distance', search.distance);
            Session.setPersistent('searchGroupListForm.keyWord', search.keyWord);
            Session.setPersistent('searchGroupListForm.groupStatus', search.groupStatus);
            if (Array.isArray(search.adults) && search.adults.length > 0) {
                Session.setPersistent('searchGroupListForm.adults', search.adults)
            } else {
                Session.setPersistent('searchGroupListForm.adults', null)
            }
            return false;
        }
    }
});

const AddressSchema = new SimpleSchema({
    fullAddress: {
        optional: true,
        type: String
    },
    lat: {
        optional: true,
        type: Number,
        decimal: true
    },
    lng: {
        optional: true,
        type: Number,
        decimal: true
    },
    geometry: {
        optional: true,
        type: Object,
        blackbox: true
    },
    placeId: {
        optional: true,
        type: String
    },
    street: {
        optional: true,
        type: String,
        max: 100
    },
    city: {
        optional: true,
        type: String,
        max: 50
    },
    state: {
        optional: true,
        type: String,
    },
    zip: {
        optional: true,
        type: String,
    },
    country: {
        optional: true,
        type: String
    }
});

export const searchSchema = new SimpleSchema({
    keyWord: {
        type: String,
        optional: true,
    },
    groupStatus: {
        optional: true,
        allowedValues: _.pluck(groupStatus, 'id'),
        type: Number,
        autoform: {
            firstOption: "All status",
            options: function () {
                return _.map(groupStatus, function (status) {
                    return {label: status.label, value: status.id}
                })
            },
            afFieldInput: {
                class: 'form-control'
            }
        }
    },
    distance: {
        type: Number,
        autoform: {
            firstOption: false,
            options: function () {
                const options = [];
                for (let i = 1; i <= 50; i++) {
                    options.push({label: `<${i} km`, value: i * 1000},)
                }
                return options
            },
        }
    },
    address: {
        type: AddressSchema,
        optional: true,
    },
    adults: {
        label: "Adult groups",
        optional: true,
        type: [String],
        autoform: {
            type: 'select-multi-checkbox-combo',
            options: [
                {
                    label: 'N/A',
                    value: 'n/a'
                },
                {
                    label: 'Applying',
                    value: 'applying'
                },
                {
                    label: 'Approved',
                    value: 'approved'
                },
                {
                    label: 'Declined',
                    value: 'declined'
                }
            ]
        }
    }
});


Template.searchGroupListForm.onCreated(function () {
    Session.setDefaultPersistent('searchGroupListForm.query', {roles: 'group'})
});
Template.searchGroupListForm.helpers({
    searchSchema: searchSchema,
    optsGoogleplace: optsGoogleplace,
    distance: ()=> {
        return Session.get('searchGroupListForm.distance')
    },
    address: ()=> {
        return Session.get('searchGroupListForm.address')
    },
    keyWord: ()=> {
        return Session.get('searchGroupListForm.keyWord')

    },
    groupStatus: ()=> {
        return Session.get('searchGroupListForm.groupStatus')

    },
    adults: ()=> {
        return Session.get('searchGroupListForm.adults')

    },
});

Template.searchGroupListForm.events({
    'click .export'(e, instance){
        BootstrapModalPrompt.prompt({
            title: "Export to CSV",
            template: Template.exportCVS,
            btnDismissText: 'Cancel',
            btnOkText: 'Export'
        }, function (data) {
            if (data) {

            }
            else {
                console.log('cancel')
            }
        });
    }
});