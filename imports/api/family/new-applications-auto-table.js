/**
 * Created by cesar on 22/11/16.
 */
import {AutoTable} from "meteor/cesarve:auto-table";
import {familyStatus} from "./family-status";
import {Tags} from "/imports/api/tags/tags";
import {Groups} from "/imports/api/group/group"

const operators = [  // Optional Array works for option filter
    {
        label: 'Equal',
        shortLabel: '=',
        operator: '$eq',
    },
    {
        label: 'More than',
        shortLabel: '>',
        operator: '$gt',
    },
    {
        label: 'Less than',
        shortLabel: '<',
        operator: '$lt',
    },
    {
        label: 'More or equal than',
        shortLabel: '≥',
        operator: '$gte',
    },
    {
        label: 'Less or equal than',
        shortLabel: '≤',
        operator: '$lte',
    },
]

const columns = [

    {key: 'parents.0.firstName',label:'Parent 1', operator: '$regex',},
    {key: 'parents.1.firstName',label:'Parent 2', operator: '$regex',},
    {key: 'parents.0.surname', operator: '$regex',},
    {key: 'contact.address.city', operator: '$regex',},
    {key: 'contact.address.suburb', operator: '$regex',},
    {key: 'contact.address.fullAddress', operator: '$regex',},
    {key: 'contact.homePhone', operator: '$regex',},
    {key: 'emails.0.address', label:'Email', operator: '$regex',},
    {
        key: 'office.familyStatus', label: 'Status', operator: '$in',
        render: function (val) {
            const status = _.findWhere(familyStatus, {id: val})
            return status && status.label || ''
        }
    },
    {
        key: 'applied', label: 'Applied',
        render: function () {
            const groupIds = _.pluck(this.groups, 'groupId')
            const groups = Groups.find({_id: {$in: groupIds}}, {fields: {name: 1, dates: 1}})
            let body = ''
            groups.forEach((group) => {
                const date0 = group.dates && group.dates[0] && group.dates[0] instanceof Date ? moment(group.dates[0]).format('DD MMM YY') : ''
                const date1 = group.dates && group.dates[1] && group.dates[1] instanceof Date ? moment(group.dates[1]).format('DD MMM YY') : ''
                body += `<nobr>${group.name}</nobr><br><nobr>(${date0} - ${date1})</nobr><hr style="margin: 0">`
            })
            return body.substr(0, body.length - 4)
        }
    },
    {
        key: 'quickNotes',
        label: 'Notes',
        operator: '$regex',
        template: 'familySearchNotes'
    },
    {
        key: 'office.firstVisit.time',
        label: 'Visit time',
        operator: '$gte',
        operators,
        template: 'familyNeApplicationVisitTime'
    },
    {
        key: 'office.firstVisit.staffId',
        label: 'Visit staff',
        operator: '$in',
        template: 'familyNeApplicationVisitStaff'
    }

]

export const newFamilyFilterSchema = new SimpleSchema({
    'groupsCount.applied': {
        type: Number,
        optional: true,
    },
    'groupsCount.confirmed': {
        type: Number,
        optional: true,
    },
    'groups.applied': {
        type: Number,
        optional: true,
    },
    'groups.confirmed': {
        type: Number,
        optional: true,
    },
    'loggedAt': {
        type: Date,
        optional: true,
        autoform:{
            type: "daterangepicker",
            dateRangePickerOptions: {
                singleDatePicker: true,
                showDropdowns: true,
                locale: {
                    format:  'DD/MM/YYYY',
                },
            },
        }

    },
    reviewed: {
        optional: true,
        type: Date,
        autoform:{
            type: "daterangepicker",
            dateRangePickerOptions: {
                singleDatePicker: true,
                showDropdowns: true,
                locale: {
                    format:  'DD/MM/YYYY',
                },
            },
        }
    },
    'other.contactDate': {
        optional: true,
        type: Date,
        autoform:{
            type: "daterangepicker",
            dateRangePickerOptions: {
                singleDatePicker: true,
                showDropdowns: true,
                locale: {
                    format:  'DD/MM/YYYY',
                },
            },
        }
    },
    'other.drive': {
        type: [String],
        optional: true,
        autoform: {
            type: 'select-multi-checkbox-combo',
            options: [
                {label: 'Yes', value: 'Yes',},
                {label: 'No', value: 'No',},
                {label: 'Maybe', value: 'Maybe'},
            ]
        }
    },
    "parents.$.firstName": {
        type: String,
        optional: true,
    },
    'parents.$.surname': {
        type: String,
        optional: true,
    },
    'contact.address.city': {
        type: String,
        optional: true,
    },

    'contact.address.suburb': {
        type: String,
        optional: true,
    },
    'contact.address.fullAddress':{
        type: String,
        optional: true,
    },
    'blueCardStatus': {
        type: [String],
        optional: true,
        autoform: {
            type: 'select-multi-checkbox-combo',
            options: [
                {label: 'n/a', value: 'n/a',},
                {label: 'approved', value: 'approved',},
                {label: 'excempt', value: 'excempt',},
                {label: 'send', value: 'send',},
                {label: 'sent', value: 'sent',},
                {label: 'apply', value: 'apply',},
                {label: 'reapply', value: 'reapply',},
                {label: 'expiring', value: 'expiring'},
                {label: 'expired', value: 'expired',},
                {label: 'declined', value: 'declined',},
            ]
        },
    },
    'office.score': {
        type: Number,
        optional: true,
    },
    'parentsCount': {
        type: Number,
        optional: true,
    },
    'childrenCount': {
        type: Number,
        optional: true,
    },
    'guestsCount': {
        type: Number,
        optional: true,
    },
    'bedroomsCount': {
        type: Number,
        optional: true,
    },
    'bedsCount': {
        type: Number,
        optional: true,
    },
    'office.tags': {
        type: [String],
        optional: true,
        autoform: {
            type: 'select-multi-checkbox-combo',
            options: function () {
                return Tags.options()
            }
        },
    },
    'office.familyStatus': {
        type: [Number],
        optional: true,
        autoform: {
            type: 'select-multi-checkbox-combo',
            options: function () {
                const filteredStatus = _.filter(familyStatus, (status) => status.id < 3)
                return _.map(filteredStatus, function (status) {
                    return {label: status.label, value: status.id}
                })
            },
        },
    },
    'office.familySubStatus': {
        type: [String],
        optional: true,
        autoform: {
            type: 'select-multi-checkbox-combo',
            options: [
                {label: 'unreliable', value: 'unreliable',},
                {label: 'active', value: 'active',},
                {label: 'inactive', value: 'inactive',},
            ]
        },
    },
    'other.preferredGender': {
        type: [String],
        optional: true,
        autoform: {
            type: 'select-multi-checkbox-combo',
            options: [
                {label: 'either', value: 'either',},
                {label: 'female', value: 'female',},
                {label: 'male', value: 'male',},
            ]
        },
    },
    'emails.$.address': {
        type: String,
        optional: true
    },
    'parents.mobilePhone': {
        type: String,
        optional: true
    },
    'contact.homePhone': {
        type: String,
        optional: true
    },
    'groups': {
        type: Number,
        optional: true,
    },
    quickNotes: {
        type: String,
        optional: true,
    },
    'office.firstVisit.time': {
        type: Date,
        optional: true,

    },
    'office.firstVisit.staffId': {
        label: 'Staff',
        type: [String],
        optional: true,
        autoform: {
            type: 'select-multi-checkbox-combo',
            options: function () {
                const staffs = Meteor.users.find({$or: [{roles: 'staff'}, {roles: 'admin'}]});
                return staffs.map((user) => {
                    return {label: user.firstName, value: user._id}
                })
            }
        }
    }
});


export const newFamiliesAutoTable = new AutoTable(
    {
        id: 'newFamiliesAutoTable',
        collection: Meteor.users,
        query: {roles: 'family', 'office.familyStatus': {$lt: 3}, 'groups.0': {$exists: 1}},
        publishExtraFields: ['roles', 'office', 'groups'],
        columns,
        schema: newFamilyFilterSchema,
        publish: function () {
            return Roles.userIsInRole(this.userId, ['admin', 'staff'])
        },
        settings: {
            options: {
                columnsSort: true,
                columnsDisplay: true,
                showing: true,
                filters: true,
            }
            ,
            klass: {
                tableWrapper: ''
            }
        }
        ,
        link: function (row, path) {
            if (path != 'office.firstVisit.staffId' && path != 'office.firstVisit.time' && path != 'quickNotes')
                return FlowRouter.path('familyEdit', {familyId: row._id})
        }
    }
)
