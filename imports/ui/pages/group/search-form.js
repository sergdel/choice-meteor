/**
 * Created by cesar on 30/9/16.
 */
import './search-form.html'
import '/imports/ui/componets/autoform/select-multi-checkbox-combo/select-multi-checkbox-combo'
import moment from 'moment'
AutoForm.hooks({
    searchGroupListForm: {
        onSubmit: function (search, modifier) {
            Session.setPersistent('searchGroupListForm.keyWord', search.keyWord);
            Session.setPersistent('searchGroupListForm.status', search.status);
            Session.setPersistent('searchGroupListForm.searchRange', search.searchRange);
            return false;
        }
    }
});


export const searchSchema = new SimpleSchema({
    keyWord: {
        type: String,
        optional: true,
    },
    status: {
        label: "Status",
        type: String,
        optional: true,
        allowedValues: ["potential", "confirmed", "cancelled"],
        autoform: {
            type: 'select-multi-checkbox-combo',
            options: "allowed",
            capitalize: true,
        },
    },
    searchRange: {
        type: [Date],
        label: "From - To",
        optional: true,
        autoform: {
            type: "daterangepicker",
            placeholder: 'Date range',
            dateRangePickerOptions: {
                minDate: moment().subtract(6, 'months'),
                maxDate: moment(),
                startDate: moment().subtract(7, 'days'),
                endDate: moment(),
                timePicker: false,
                locale: {
                    format:  'DD/MM/YYYY',
                },
                autoUpdateInput: false,
                linkedCalendars: false,
            }
        }
    },
});


Template.searchGroupListForm.onCreated(function () {
    Session.setDefaultPersistent('searchGroupListForm.query', {roles: 'group'})
});
Template.searchGroupListForm.helpers({
    searchSchema: searchSchema,

    keyWord: ()=> {
        return Session.get('searchGroupListForm.keyWord')

    },
    status: ()=> {
        return Session.get('searchGroupListForm.status')

    },
    searchRange: ()=> {
        return Session.get('searchGroupListForm.searchRange')

    },
});

Template.searchGroupListForm.events({

});