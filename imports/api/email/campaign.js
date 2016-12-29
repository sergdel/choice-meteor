/**
 * Created by cesar on 18/11/16.
 */
import {Families} from '/imports/api/family/family'
import {AutoTable} from 'meteor/cesarve:auto-table'
import {SimpleSchema} from 'meteor/aldeed:simple-schema'
import {EmailTemplates} from '/imports/api/email/templates'
import {familyStatus} from "/imports/api/family/family-status";

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




const operatorsExist=operators.concat([{
    label: 'No value',
    shortLabel: '∃',
    operator: '$exists',
    schemaFilter: 'trueFalse',
}])

const emailFamilyFilter = new SimpleSchema({

    'emails.$.address': {
        label: 'Email',
        type: String,
        optional: true,
    },
    "parents.firstName": {
        type: String,
        optional: true,
    },
    'parents.surname': {
        type: String,
        optional: true,
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
    "contact.address.suburb": {
        optional: true,
        type: String,
    },
    'groups.applied':{
        type: Number,
        optional: true,
    },
    'groups.confirmed':{
        type: Number,
        optional: true,
    },
    'loggedAt':{
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
    'other.drive':{
        type:[String],
        optional: true,
        autoform:{
            type: 'select-multi-checkbox-combo',
            options: [
                {label: 'Yes', value: 'Yes',},
                {label: 'No', value: 'No',},
                {label: 'Maybe', value: 'Maybe',},
            ]
        }
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
    'parentsCount': {
        type: Number,
        optional: true,
    },
    'childrenCount': {
        type: Number,
        optional: true,
    },
    'groupsCount.applied':{
        type: Number,
        optional: true,
    },
    'groupsCount.confirmed':{
        type: Number,
        optional: true,
    },
    'groupsCount.available':{
        type: Number,
        optional: true,
    },
    unavailabilityCount:{
        type: Number,
        optional: true,
    },

})



export const campaignAutoTable = new AutoTable({
    id: 'campaignList',
    columns: [
        {
            key: 'emails.0.address',
            label: 'Email',
            operator: '$regex'
        },
        {
            key: 'parents.firstName',
            label: 'Parents',
            operator: '$regex',
            render: function(val,path){
                const parent2= (this.parents[1] &&  this.parents[1].firstName && (' & ' + this.parents[1].firstName)) || ''
                return this.parents[0].firstName + parent2
            }
        },
        {
            key: 'parents.surname',
            label: 'Surname',
            operator: '$regex'
        },
        {
            key: 'loggedAt',
            label: 'Last Login',
            operator: '$gte',
            operators: operators,
            render: function (val) {
                if (!val) return ''
                const m = moment(val)
                if (!m.isValid()) return val
                return m.format('Do MMM YYYY')
            },
        },
        {
            key: 'reviewed',
            label: 'Last Update',
            operator: '$gte',
            operators,
            render: function (val) {
                if (!val) return ''
                const m = moment(val)
                if (!m.isValid()) return val
                return m.format('Do MMM YYYY')
            },
        },
        {
            key: 'unavailabilityCount',
            label: 'Unavailability',
            operator: '$eq',
            operators,
        },
        {
            key: 'other.contactDate',
            label: 'Enquiry date',
            operator: '$gte',
            operators,
            render: function (val) {
                if (!val) return ''
                const m = moment(val)
                if (!m.isValid()) return val
                return m.format('Do MMM YYYY')
            },
        },
        {
            key: 'other.drive',
            label: 'Drive?',
            operator: '$in',
        },
        {
            key:'blueCardStatus',
            label: 'Blue Card',
            operator: '$in',
        },
        {
            key: 'parentsCount', label: '# parents', operator: '$eq', operators
        },
        {
            key: 'childrenCount', label: '# children', operator: '$eq', operators
        },
        {
            key: 'office.familyStatus', operator: '$in',
            render: function (val) {
                const status = _.findWhere(familyStatus, {id: val})
                return status && status.label || ''
            }
        },
        {key: 'office.familySubStatus', operator: '$in',},
        {
            key: "contact.address.suburb",
            label: 'Suburb',
            operator: '$regex'
        },
        {key: 'groupsCount.applied', label: '# Applied', operator: '$eq', operators},
        {key: 'groupsCount.confirmed', label: '# Confirmed', operator: '$eq', operators},
        {key: 'groupsCount.available', label: '# Available', operator: '$eq', operators},
    ],
    collection: Meteor.users,
    query: {roles: 'family'},
    publishExtraFields: ['roles'],
    schema: emailFamilyFilter,
    settings: {
        options: {
            columnsSort: true,
            columnsDisplay: true,
            filters: true,
            showing: true,
        }
    },
    publish: function () {
        return Roles.userIsInRole(this.userId, 'admin')
    }

})

//export const Campaign = new Mongo.Collection('campaign')

export const campaignSchema = new SimpleSchema({
    'name': {
        type: String,
    },
    query: {
        type: Object,
        blackbox: true,
        optional: true,
        autoform: {
            type: 'auto-table',
            at: campaignAutoTable,
        }
    },
    template: {
        type: String,
        autoform: {
            options: function () {
                return EmailTemplates.find({campaign: true}).map((template) => {
                    return {value: template._id, label: template.description}
                })
            },
        }
    }
})
