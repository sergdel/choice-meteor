/**
 * Created by cesar on 30/9/16.
 */
import './search-form.html'
import {optsGoogleplace} from "/imports/api/family/contact";
import '/imports/ui/pages/family/export'
AutoForm.hooks({
    searchFamilyListForm: {
        onSubmit: function (search, modifier) {

            //hack, beacouse when the input is clean the value of the address dosen0t change
            //that why i check if the input itself is empty then i clean the address
            if ($('[name="address"]').val()==''){
                Session.set('searchFamilyListForm.address', undefined)
            }else{
                if (search.address && search.address.geometry) {


                    Session.set('searchFamilyListForm.address', search.address);
                    Session.set('searchFamilyListForm.distance', search.distance);
                } else {


                    Session.set('searchFamilyListForm.address', undefined)
                }
            }

            Session.set('searchFamilyListForm.availableDuration', search.availableDuration);
            Session.set('searchFamilyListForm.queryContact', search.queryContact)
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
    availableDuration: {
        type: [Date],
        optional: true,
        autoform:{
            type: 'daterangepicker',
            afFormGroup: {
                "formgroup-class": 'col-sm-6',

            },
            dateRangePickerOptions: {
                locale: {
                    format:  'DD/MM/YYYY',
                },
            }
        }
    },
    queryContact:{
        type: String,
        optional: true
    }
});

Template.searchFamilyListForm.onCreated(function () {

});
Template.searchFamilyListForm.helpers({
    searchSchema: searchSchema,
    optsGoogleplace: optsGoogleplace,
    distance: ()=> {
        return Session.get('searchFamilyListForm.distance')
    },
    address: ()=> {
        return Session.get('searchFamilyListForm.address')
    },
    queryContact: ()=> {
        return Session.get('searchFamilyListForm.queryContact')
    },
});

Template.searchFamilyListForm.events({
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
            }
        });
    }
});