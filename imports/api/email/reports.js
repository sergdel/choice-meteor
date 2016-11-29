/**
 * Created by cesar on 18/11/16.
 */
import {AutoTable} from 'meteor/cesarve:auto-table'
import {Email} from 'meteor/email'
import {FlowRouter} from 'meteor/kadira:flow-router'
const reportFilterSchema = new SimpleSchema({
    parent1: {
        type: String,
        optional: true,
    },
    parent2: {
        type: String,
        optional: true,
    },
    surname: {
        type: String,
        optional: true,
    },
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
                {value: 'sent', label: 'Sent'},
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
    loggedAt: {
        type: Date,
        optional: true
    }
})
const operators = [
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
export const reportsAutoTable = new AutoTable({
    id: 'reportAutoTable',
    collection: Email,
    schema: reportFilterSchema,
    publishExtraFields: ['userId','html'],
    settings: {
        options: {
            columnsSort: true,
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
        {key: 'campaign', label: 'Campaign ', operator: '$regex'},
        {
            key: 'sentAt', label: 'Sent at', operator: '$eq', operators
        },
        {key: 'status', label: 'Status', operator: '$in'},
        {
            key: 'loggedAt', label: 'Last login', operator: '$eq',
            operators
        },
        {
            key: 'action', label: 'Action',
            render: function () {
                var entityMap = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': '&quot;',
                    "'": '&#39;',
                    "/": '&#x2F;'
                };

                function escapeHtml(string) {
                    return String(string).replace(/[&<>"'\/]/g, function (s) {
                        return entityMap[s];
                    });
                }
                const btn1 = '<a  data-toggle="modal" data-target="#body" class="btn btn-xs btn-default" role="button"  data-content="' + escapeHtml(this.html) + '"><i class="fa fa-envelope"></i></a>'
                const btn2 = '<a target="_blank"  href="' + FlowRouter.path('familyEdit', {familyId: this.userId}) + '" class="btn btn-xs btn-default"><i class="fa fa-external-link"></i></a>'
                return btn1 + btn2
            }

        },

    ],
    link: function(doc,key){
        return  FlowRouter.path('familyEdit', {familyId: doc.userId})
    }

})
