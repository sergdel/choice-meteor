/**
 * Created by cesar on 30/9/16.
 */
import './search-form.html'
import moment from 'moment'
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
            type: "bs-date-range-picker",
            //rangeDatePickerValue: moment().subtract(50, 'years').format("DD/MM/YYYY") + " - " + moment().add(50,'years').format("DD/MM/YYYY"),
            rangeDatePickerOptions: {
                minDate: moment().subtract(50, 'years'),
                maxDate: moment().add(50,'years'),
                startDate: moment().subtract(50, 'years'),
                endDate: moment().add(50,'years'),
                timePicker: false,
                locale: {
                    format:  'DD/MM/YYYY',
                },
                autoUpdateInput: false,
                linkedCalendars: false,
            }
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
                {label: 'Applying', value: 'applying'},
                {label: 'Approved', value: 'approved'},
                {label: 'Declined', value: 'declined'},
                {label: 'Expired', value: 'expired'},
                {label: 'N/A', value: 'n/a'}
            ]
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
});
