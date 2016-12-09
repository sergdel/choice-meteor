/**
 * Created by cesar on 30/9/16.
 */
import './search-form.html'
import {optsGoogleplace} from "/imports/api/family/contact";

AutoForm.hooks({
    searchCampaignListForm: {
        onSubmit: function (search, modifier) {
            let customQuery = {}
            if (search  && search.address && search.address.geometry) {
                
                if (search.address) {
                    customQuery = {
                        "contact.address.geometry": {
                            $near: {
                                $geometry: search.address.geometry,
                                $maxDistance: search.distance
                            }
                        }
                    }

                }
                
                Session.set('campaignList_customQuery',customQuery)
            } else {
                Session.set('campaignList_customQuery',undefined)

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
});

Template.searchCampaignListForm.onCreated(function () {
    Session.setDefaultPersistent('searchCampaignListForm.query', {roles: 'family'})
});
Template.searchCampaignListForm.helpers({
    searchSchema: searchSchema,
    optsGoogleplace: optsGoogleplace,
    distance: ()=> {
        return Session.get('searchCampaignListForm.distance')
    },
    address: ()=> {
        return Session.get('searchCampaignListForm.address')
    },
});
