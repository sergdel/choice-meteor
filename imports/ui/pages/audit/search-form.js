/**
 * Created by cesar on 30/9/16.
 */

import './search-form.html'
import moment from 'moment'

AutoForm.hooks({
    searchAuditListForm: {
        onSubmit: function (search, modifier,) {
            Session.setPersistent('searchAuditListForm.actions', search.actions);
            Session.setPersistent('searchAuditListForm.keyWord', search.keyWord);
            Session.setPersistent('searchAuditListForm.roles', search.roles);
            Session.setPersistent('searchAuditListForm.staff', search.staff);
            Session.setPersistent('searchAuditListForm.searchRange', search.searchRange);
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
            type: "daterangepicker",
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
    roles: {
        label: "User roles",
        optional: true,
        type: [String],
        autoform: {
            type: 'select-multi-checkbox-combo',
            firstOption: "Roles",
            options: [
                {label: "Admin", value: 'admin'},
                {label: "Staff", value: 'staff'},
                {label: "family", value: 'family'}
            ],
        }
    },
    actions: {
        label: "Actions types",
        optional: true,
        type: [String],
        autoform: {
            type: 'select-multi-checkbox-combo',
            options: [
                {label: "Created", value: 'insert'},
                {label: "Accessed", value: 'findOne'},
                {label: "Updated", value: 'update'}
            ],
        }
    },
    staff: {
        label: "Staff",
        optional: true,
        type: [String],
        autoform: {
            type: 'select-multi-checkbox-combo',

        }
    }
});


Template.searchAuditListForm.onCreated(function () {
    this.subscribe('staffs');
    Session.setDefaultPersistent('searchAuditListForm.query', {})
});
Template.searchAuditListForm.helpers({
    actions: ()=> {
        return Session.get('searchAuditListForm.actions')
    },
    roles: ()=> {
        return Session.get('searchAuditListForm.roles')
    },
    keyWord: ()=> {
        return Session.get('searchAuditListForm.keyWord')

    },
    staff: ()=> {
        return Session.get('searchAuditListForm.staff')

    },
    searchRange:()=>{
        return Session.get('searchAuditListForm.searchRange')
    },
    staffOptions: ()=> {
        return function () {
            const staffs = Meteor.users.find({roles: 'staff'});
            return staffs.map((user)=> {
                return {label: user.firstName, value: user._id}
            })
        }

    },
    searchSchema: searchSchema
});