/**
 * Created by cesar on 30/9/16.
 */
import './search-form.html'
import {optsGoogleplace} from "/imports/api/family/contact";
import '/imports/ui/pages/family/export'


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
    queryContact:{
        type: String,
        optional: true
    }
});

Template.searchFamilyListForm.onCreated(function () {
    const listName=this.data.listName
    AutoForm.hooks({
        [listName]: {
            onSubmit: function (search, modifier) {
                console.log('AutoForm.hooks ' + listName, search, modifier)
                //hack, beacouse when the input is clean the value of the address dosen0t change
                //that why i check if the input itself is empty then i clean the address
                if ($('[name="address"]').val()==''){
                    Session.set(listName+'.address', undefined)
                }else{
                    if (search.address && search.address.geometry) {
                        Session.set(listName+'.address', search.address);
                        Session.set(listName+'.distance', search.distance);
                    } else {
                        Session.set(listName+'.address', undefined)
                    }
                }
                Session.set(listName+'.queryContact', search.queryContact)
                return false;
            }
        }
    });
});
Template.searchFamilyListForm.helpers({
    searchSchema: searchSchema,
    optsGoogleplace: optsGoogleplace,
    distance: ()=> {
        return Session.get(Template.instance().data.listName+'.distance')
    },
    address: ()=> {
        return Session.get(Template.instance().data.listName+'.address')
    },
    queryContact: ()=> {
        return Session.get(Template.instance().data.listName+'.queryContact')
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