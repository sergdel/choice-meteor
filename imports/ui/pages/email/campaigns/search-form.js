/**
 * Created by cesar on 30/9/16.
 */
import './search-form.html'
import {optsGoogleplace} from "/imports/api/family/contact";

AutoForm.hooks({
    searchCampaignListForm: {
        onSubmit: function (search, modifier) {
            let customQuery = {};
            if (search  && search.address && search.address.geometry) {

                if (search.address) {
                    customQuery = _.extend(customQuery,{
                        "contact.address.geometry": {
                            $near: {
                                $geometry: search.address.geometry,
                                $maxDistance: search.distance
                            }
                        }
                    });

                }
            }

            if (search.available) {
                customQuery = _.extend(customQuery,
                    {"availability" :
                    {
                        $not : {
                            $elemMatch: {
                                $or: [
                                    {
                                        $and: [
                                            {"dates.0": {$gte: search.available[0]}},
                                            {"dates.0": {$lte: search.available[1]}}
                                        ]
                                    },
                                    {
                                        $and: [
                                            {"dates.1": {$gte: search.available[0]}},
                                            {"dates.1": {$lte: search.available[1]}}
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                    }
                );
            }

            if (search.groupDuration) {
                customQuery = _.extend(customQuery,
                    {
                        "$or" : [
                            {"groupDuration": { "$exists" : false}},
                            {
                                "groupDuration":{
                                    "from": search.groupDuration[0],
                                    "to": search.groupDuration[1]
                                }
                            }
                        ]
                    }
                );
            }
            Session.set('searchCampaignListForm.groupDuration', search.available);
            Session.set('searchCampaignListForm.groupDuration', search.groupDuration);
            Session.set('searchCampaignListForm.distance', search.distance);
            Session.set('searchCampaignListForm.address', search.address);
            if (Object.keys(customQuery).length)
                Session.set('campaignList_customQuery',customQuery)
            else
                Session.set('campaignList_customQuery',undefined)
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
    available: {
        type: [Date],
        optional: true,
        autoform:{
            type: 'daterangepicker',
            afFormGroup: {
                "formgroup-class": 'col-lg-3',

            },
            dateRangePickerOptions: {
                locale: {
                    format:  'DD/MM/YYYY',
                },
            }
        }
    },
    groupDuration: {
        type: [Date],
        optional: true,
        autoform:{
            type: 'daterangepicker',
            afFormGroup: {
                "formgroup-class": 'col-lg-3',

            },
            dateRangePickerOptions: {
                locale: {
                    format:  'DD/MM/YYYY',
                },
            }
        }
    },
});

Template.searchCampaignListForm.onCreated(function () {
    Session.setDefaultPersistent('searchCampaignListForm.query', {roles: 'family'})
});
Template.searchCampaignListForm.helpers({
    searchSchema: searchSchema,
    optsGoogleplace: optsGoogleplace,
    groupDuration:()=>{
        return Session.get('searchCampaignListForm.groupDuration')
    },
    available:()=>{
        return Session.get('searchCampaignListForm.groupDuration')
    },
    distance: ()=> {
        return Session.get('searchCampaignListForm.distance')
    },
    address: ()=> {
        return Session.get('searchCampaignListForm.address')
    },
});
