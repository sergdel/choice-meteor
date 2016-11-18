/**
 * Created by cesar on 18/11/16.
 */
import {AutoTable} from 'meteor/cesarve:auto-table'
import {Email} from 'meteor/email'

const reportFilterSchema = new SimpleSchema({
    to: {
        type: String,
        optional: true,
    },
    subject: {
        type: String,
        optional: true,
    },
    text: {
        type: String,
        optional: true,
    },
    campaign: {
        type: String,
        optional: true,
    },
    sentAt: {
        type: Date,
        optional: true
    },
    status: {
        type: [String],
        optional: true,
        autoform: {
            class: 'btn-xs',
            type: 'select-multi-checkbox-combo',
            options: [
                {value: 'accepted', label: 'Accepted'},
                {value: 'rejected', label: 'Rejected'},
                {value: 'delivered', label: 'Delivered'},
                {value: 'failed', label: 'Failed'},
                {value: 'opened', label: 'Opened'},
                {value: 'clicked', label: 'Clicked'},
                {value: 'unsubscribed', label: 'Unsubscribed'},
                {value: 'complained', label: 'Complained'},
            ]
        }
    },
    loggedAt:{
        type: Date,
        optional: true
    }
})
export const reportsAutoTable = new AutoTable({
    id: 'reportAutoTable',
    collection: Email,
    schema: reportFilterSchema,
    settings: {
        options: {
            columnsDisplay: true,
            filters: true,
            showing: true,
        }
    },
    columns: [
        {key: 'parent1', label: 'Parent 1'},
        {key: 'parent2', label: 'Parent 2'},
        {key: 'surname', label: 'Surname'},
        {key: 'city', label: 'City'},
        {key: 'suburb', label: 'Suburb'},
        {key: 'to', label: 'To', operator: '$regex'},
        {key: 'subject', label: 'Subject ', operator: '$regex'},
        {key: 'text', label: 'Body ', operator: '$regex', invisible: true},
        {key: 'campaign', label: 'Campaign ', operator: '$regex'},
        {
            key: 'sentAt', label: 'Sent at', operator: '$eq',
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

        {key: 'status', label: 'Status', operator: '$eq'},
        {
            key: 'loggedAt', label: 'Last login', operator: '$eq',
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
                }
            ]
        }
    ],

})
