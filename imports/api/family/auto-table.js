/**
 * Created by cesar on 22/11/16.
 */
import {AutoTable} from "meteor/cesarve:auto-table";
import {familyStatus} from "./family-status";
import {Groups} from "/imports/api/group/group";
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

const operatorsExist=operators.concat([{
    label: 'No value',
    shortLabel: '∃',
    operator: '$exists',
    options: [{label: 'Yes', value: 1},{ label: 'No', value: 0 }]
}])

const renderGroup= function (groups,type) {

    let body = ''
    groups.forEach((group) => {
        const date0 = group.dates && group.dates[0] && group.dates[0] instanceof Date ? moment(group.dates[0]).format('DD MMM YY') : ''
        const date1 = group.dates && group.dates[1] && group.dates[1] instanceof Date ? moment(group.dates[1]).format('DD MMM YY') : ''
        body += `<nobr>${group.name}</nobr><br><nobr>(${date0} - ${date1})</nobr><hr style="margin: 0">`
    })
    return body.substr(0, body.length - 4)
}

const columns = [

    {
        key: 'parents.firstName',
        label: 'Parents',
        operator: '$regex',
        render: function(val,path){
            const parent2= (this.parents[1] &&  this.parents[1].firstName && (' & ' + this.parents[1].firstName)) || ''
            return this.parents[0].firstName + parent2
        }
    },
    {key: 'parents.surname', operator: '$regex',},
    {key: 'contact.address.city', operator: '$regex',},
    {key: 'contact.address.suburb', operator: '$regex',},
    {key: 'blueCardStatus', label: 'Blue cards', operator: '$in',},
    {
        key: 'office.score', operator: '$eq', operators
    },
    {
        key: 'parentsCount', label: '# parents', operator: '$eq', operators,
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
        key: 'office.familyStatus', label: 'Status', operator: '$in',
        render: function (val) {
        const status = _.findWhere(familyStatus, {id: val})
        return status && status.label || ''
    }

    },
    {key: 'office.familySubStatus', label: 'Sub-status', operator: '$in',},
    {key: 'other.preferredGender', label: 'Gender pref', operator: '$in',},


    {key: 'groupsCount.applied', label: '# Applied', operator: '$eq', operators},
    {key: 'groupsCount.confirmed', label: '# Confirmed', operator: '$eq', operators},
    {key: 'groupsCount.available', label: '# Potential', operator: '$eq', operators},

    {key: 'groupsApplied', label: '# Applied',
        render: function(){
            const groupIds = _.pluck(_.where(this.groups,{status: 'applied'}), 'groupId')
            const groups = Groups.find({_id: {$in: groupIds}}, {fields: {name: 1, dates: 1}})
            return renderGroup(groups)
        }
    },
    {key: 'groupsConfirmed', label: '# Confirmed',
        render: function(){
            const groupIds = _.pluck(_.where(this.groups,{status: 'confirmed'}), 'groupId')
            const groups = Groups.find({_id: {$in: groupIds}}, {fields: {name: 1, dates: 1}})
            return renderGroup(groups)
        }
    },
    /*{key: 'groupsAvailable', label: '# Potential',
        render: function(){
            const groupIds1 = _.pluck(_.where(this.groups,{status: 'applied'}), 'groupId')
            const groupIds2 = _.pluck(_.where(this.groups,{status: 'confirmed'}), 'groupId')
            const groups = Groups.find({_id: {$nin: groupIds1.concat(groupIds2)}}, {fields: {name: 1, dates: 1}})
            return renderGroup(groups)
        }
    },*/


    {
        key: 'contactInfo', label: 'Contact',
        template: 'familyContact',
    },
    {
        key: 'loggedAt',
        label: 'Last Login',
        operator: '$gte',
        operators,
        render: function (val) {
            if (!val) return ''
            const m = moment(val)
            if (!m.isValid()) return val
            if (m<=new Date(2012,1,1)){
                return 'never'
            }
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
        operators
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
        key: 'quickNotes',
        label: 'Notes',
        operator: '$regex',
        template: 'familySearchNotes'
    }

]

export const familyFilterSchema = new SimpleSchema({
    unavailabilityCount:{
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
                {label: 'Maybe', value: 'Maybe'},
            ]
        }
    },
    "parents.firstName": {
        type: String,
        optional: true,
    },
    'parents.surname': {
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
    },
    quickNotes: {
        type: String,
        optional: true,
    },
});


export const familiesAutoTable = new AutoTable(
    {
        id: 'familyList',
        collection: Meteor.users,
        query: {roles: 'family'},
        publishExtraFields: ['roles','emails','groups'],
        columns,
        schema: familyFilterSchema,
        publish: function () {
            return Roles.userIsInRole(this.userId, ['admin','staff'])
        },
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
            if (path != 'contactInfo' && path != 'quickNotes')
                return FlowRouter.path('familyEdit', {familyId: row._id})
        }
    }
)
