/**
 * Created by cesar on 22/11/16.
 */
import {AutoTable} from "meteor/cesarve:auto-table";
import {familyStatus} from "./family-status";
import {Tags} from "/imports/api/tags/tags";

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

    {key: 'parents.0.firstName', operator: '$regex',},
    {key: 'parents.0.surname', operator: '$regex',},
    {key: 'contact.address.city', operator: '$regex',},
    {key: 'contact.address.suburb', operator: '$regex',},
    {key: 'blueCardStatus', label: 'Blue cards', operator: '$in',},
    {
        key: 'office.score', operator: '$eq', operators
    },
    {
        key: 'parentsCount', label: '# parents', operator: '$eq', operators
    },
    {
        key: 'childrenCount', label: '# children', operator: '$eq', operators
    },
    {
        key: 'guestsCount', label: '# guests', operator: '$eq', operators
    },
    {
        key: 'bedroomsCount', label: '# bedrooms', operator: '$eq', operators
    },
    {
        key: 'bedsCount', label: '# beds', operator: '$eq', operators

    },
    {key: 'office.tags', operator: '$in',},
    {
        key: 'office.familyStatus', label: 'Status', operator: '$in', render: function (val) {
        const status = _.findWhere(familyStatus, {id: val})
        return status && status.label || ''
    }
    },
    {key: 'office.familySubStatus', label: 'Sub-status', operator: '$in',},
    {key: 'other.preferredGender', label: 'Gender pref', operator: '$in',},
    {key: 'groupsCount.applied', label: 'Applied', operator: '$eq', operators},
    {
        key: 'contactInfo', label: 'Contact',
        template: 'familyContact',
    }

]

export const familyFilterSchema = new SimpleSchema({

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
                return _.map(familyStatus, function (status) {
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
    'emails.address': {
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
    }
});


export const familiesAutoTable = new AutoTable(
    {
        id: 'familyList',
        collection: Meteor.users,
        query: {roles: 'family'},
        publishExtraFields: ['roles','emails'],
        columns,
        schema: familyFilterSchema,
        settings: {
            options: {
                columnsSort: true,
                columnsDisplay: true,
                showing: true,
                filters: true,
            },
            klass: {
                tableWrapper: ''
            }
        },
        link: function (row, path) {
            if (path != 'contactInfo')
                return FlowRouter.path('familyEdit', {familyId: row._id})
        }
    }
)
