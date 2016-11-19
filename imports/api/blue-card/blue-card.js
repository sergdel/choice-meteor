/**
 * Created by cesar on 30/10/16.
 */
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {AutoTable} from "meteor/cesarve:auto-table";
export const BlueCard = new Mongo.Collection('bluecard');
/*
 firstName
 surname
 dateOfBirth
 number
 expiryDate
 status
 */


BlueCard.filterSchema = new SimpleSchema({
    firstName: {
        type: String,
        optional: true,
    },
    surname: {
        type: String,
        optional: true,
    },
    dateOfBirth: {
        type: Date,
        optional: true,
    },
    number: {
        optional: true,
        type: String,
    },
    expiryDate: {
        optional: true,
        type: Date,
    },
    "status": {
        label: 'Status',
        optional: true,
        type: [String],
        autoform: {
            type: 'select-multi-checkbox-combo',
            options: [
                {label: 'Apply', value: 'apply',},
                {label: 'Reapply', value: 'reapply'},
                {label: 'Sent', value: 'sent'},
                {label: 'Send', value: 'send'},
                {label: 'Approved', value: 'approved'},
                {label: 'Excempt', value: 'excempt'},
                {label: 'Declined', value: 'declined'},
                {label: 'Expired', value: 'expired'},
                {label: 'n/a', value: 'n/a'}]
        },
    },
    type: {
        label: 'Type',
        optional: true,
        type: [String],
        autoform: {
            type: 'select-multi-checkbox-combo',
            options: [{label: 'Parents', value: 'parents'}, {label: 'Children', value: 'children'}, {
                label: 'Guests',
                value: 'guests'
            },]
        }
    },
    registered: {
        label: 'Registered',
        optional: true,
        type: [String],
        autoform: {
            type: 'select-multi-checkbox-combo',
            options: [
                {label: 'N/A', value: ''},
                {label: 'Sponsored', value: 'sponsored'},
                {label: 'Authorised', value: 'authorised'}],
        }
    }
})
BlueCard.autoTable = new AutoTable({
    columns: [
        {
            key: 'firstName',
            operator: '$regex',
        },
        {
            key: 'surname',
            operator: '$regex',
        },
        {
            key: 'dateOfBirth',
            render: function (val) {
                const m = moment(val)
                if (!m.isValid()) return val
                return m.format('Do MMM YY')
            },
            operator: '$gte',
            operators: [
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
                }]
        },
        {
            key: 'number',
            operator: '$regex',
        },
        {
            key: 'expiryDate',
            operator: '$gte',
            render: function (val) {
                const m = moment(val)
                if (!m.isValid()) return val
                return m.format('Do MMM YY') + ' - ' + m.fromNow()
            },
            operators: [
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
                }]
        },
        {
            key: 'status',
            operator: '$in',
        },
        {
            key: 'type',
            operator: '$in',
        },
        {
            key: 'registered',
            operator: '$in',
        },

    ],
    id: 'BlueCards',
    schema: BlueCard.filterSchema,
    query: {$or: [{dateOfBirth: {$lte: moment().subtract(17.5, 'years').toDate()}}, {dateOfBirth: {$not: {$type: 9}}}]},
    collection: BlueCard,
    settings: {
        options: {
            columnsSort: true,
            columnsDisplay: true,
            showing: true,
            filters: true,
        }
    },
    publishExtraFields: ['familyId'],
    link: function (doc) {

        return FlowRouter.path('familyEdit', {familyId: doc.familyId}) + '#' + doc.type
    }
})

