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

const emailFamilyFilter = new SimpleSchema({
    'emails.$.address': {
        label: 'Email',
        type: String,
        optional: true,
    },
    'parents.$.firstName': {
        label: 'First name',
        type: String,
        optional: true,
    },
    'parents.$.surname': {
        label: 'Surname',
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
    }

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
            key: 'parents.0.firstName',
            label: 'First name',
            operator: '$regex'
        },
        {
            key: 'parents.0.surname',
            label: 'Surname',
            operator: '$regex'
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
        {key: 'groupsCount.applied', label: 'Applied', operator: '$eq', operators},
        {key: 'groupsCount.confirmed', label: 'Confirmed', operator: '$eq', operators},
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
