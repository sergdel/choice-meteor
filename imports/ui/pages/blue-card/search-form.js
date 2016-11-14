/**
 * Created by cesar on 30/9/16.
 */
import './search-form.html'
import {moment} from 'meteor/momentjs:moment'
//import {blueCardStatus} from "/imports/api/blueCard/blueCard-status";
import '/imports/ui/componets/autoform/select-multi-checkbox-combo/select-multi-checkbox-combo'
AutoForm.hooks({
    searchBlueCardListForm: {
        onSubmit: function (search, modifier,) {
            Session.setPersistent('searchBlueCardListForm.searchRange', search.searchRange);
            Session.setPersistent('searchBlueCardListForm.keyWord', search.keyWord);
            Session.setPersistent('searchBlueCardListForm.status', search.status);
            return false;
        }
    }
});

export const searchSchema = new SimpleSchema({
    keyWord: {
        type: String,
        optional: true,
    },
    searchRange: {
        type: [Date],
        label: "From - To",
        optional: true,
        autoform: {
            placeholder: 'Expires between',
            type: "daterangepicker",
            //rangeDatePickerValue: moment().subtract(50, 'years').format("DD/MM/YYYY") + " - " + moment().add(50,'years').format("DD/MM/YYYY"),
            dateRangePickerOptions: {
                "ranges": {
                    "Last 12 month": [
                        moment().subtract(12, 'months'),
                        moment()
                    ],
                    "Last 6 month": [
                        moment().subtract(6, 'months'),
                        moment()
                    ],
                    "Next 6 month": [
                        moment(),
                        moment().add(6, 'months'),
                    ],
                    "Next 12 month": [
                        moment(),
                        moment().add(12, 'months'),
                    ],
                },
                "alwaysShowCalendars": true,
                timePicker: false,
                locale: {
                    format: 'DD/MM/YYYY',
                },
                showCustomRangeLabel: false,
                autoUpdateInput: false,
                linkedCalendars: false,
            }
        }
    },
    registered: {
        label: "Registered",
        optional: true,
        type: [String],
        autoform: {
            type: 'select-multi-checkbox-combo',
            options: [
                {label: 'N/A', value: ''},
                {label: 'Sponsored', value: 'Sponsored'},
                {label: 'Authorised', value: 'Authorised'},
            ]
        }
    },
    status: {
        label: "Status",
        optional: true,
        type: [String],
        autoform: {
            type: 'select-multi-checkbox-combo',
            options: [
                {label: 'Apply', value: 'apply'},
                {label: 'Reapply', value: 'reapply'},
                {label: 'Sent', value: 'sent'},
                {label: 'Send', value: 'send'},
                {label: 'Approved', value: 'approved'},
                {label: 'Excempt', value: 'excempt'},
                {label: 'Declined', value: 'declined'},
                {label: 'Expired', value: 'expired'},
                {label: 'n/a', value: 'n/a'}]

        }
    },
});


Template.searchBlueCardListForm.onCreated(function () {
    Session.setDefaultPersistent('searchBlueCardListForm.query', {})
});
Template.searchBlueCardListForm.helpers({
    searchSchema: searchSchema,
    status: ()=> {
        return Session.get('searchBlueCardListForm.status')
    },
    keyWord: ()=> {
        return Session.get('searchBlueCardListForm.keyWord')

    },
    searchRange: ()=> {
        return Session.get('searchBlueCardListForm.searchRange')

    },
    registered: ()=> {
        return Session.get('searchBlueCardListForm.registered')

    },
});
