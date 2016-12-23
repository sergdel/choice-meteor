/**
 * Created by cesar on 9/12/16.
 */

/*
 1) Guest # (adjustable #)
 2) Name  (adjustable text)
 3) Aussie Name  (adjustable text)
 4) Position (adjustable text)
 5) Gender  (adjustable text)
 6) Age # (adjustable #)
 7) Birthdate (adjustable text)
 8) Mobile # (adjustable text)
 9) Medical (adjustable text)
 10) Requirements  (adjustable text)
 11) Home # (adjustable text)
 12) From  (Date)
 13) To (Date)
 14) Status (Placing, Confirmed, NA)

 */

import  {LocalCollection} from 'meteor/minimongo'
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {AutoTable} from "meteor/cesarve:auto-table";
import {FlowRouter} from 'meteor/kadira:flow-router'
import {Audit} from '/imports/api/audit/audit'


class GuestCollection extends Mongo.Collection {
}

export const Guests = new GuestCollection('guests')

export const guestsSchema = new SimpleSchema({
    guest: {
        type: Number,
        min: 1
    },
    name: {
        type: String,
    },
    aussieName: {
        type: String,
    },
    position: {
        type: String,
    },
    gender: {
        type: String,
        optional: true,
        allowedValues: ['female', 'male'],
        autoform: {
            type: 'select-multi-checkbox-combo',
            options: 'allowed',
            capitalize: true,
        },
    },
    age: {
        type: String,
    },
    birthdate: {
        type: String,
    },
    mobile: {
        type: String,
    },
    medical: {
        type: String,
    },
    requirements: {
        type: String,
    },
    home: {
        type: String,
    },
    from: {
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
    to: {
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
    status: {
        type: String,
        allowedValues: ['placing', 'confirmed', 'n/a'],
        autoform: {
            options: [
                {label: 'Placing', value: 'placing'},
                {label: 'Confirmed', value: 'confirmed'},
                {label: 'N/A', value: 'n/a'},
            ]
        }
    },
})

export const guestsFilterSchema = new SimpleSchema({
    guest: {
        type: Number,
        optional: true,
    },
    name: {
        type: String,
        optional: true,
    },
    aussieName: {
        type: String,
        optional: true,
    },
    position: {
        type: String,
        optional: true,
    },
    gender: {
        type: String,
        optional: true,
        allowedValues: ['female', 'male'],
        autoform: {
            type: 'select-multi-checkbox-combo',
            options: 'allowed',
            capitalize: true,
        },
    },
    age: {
        type: String,
        optional: true,
    },
    birthDate: {
        type: String,
        optional: true,
    },
    mobile: {
        type: String,
        optional: true,
    },
    medical: {
        type: String,
        optional: true,
    },
    requirements: {
        type: String,
        optional: true,
    },
    home: {
        type: String,
        optional: true,
    },
    from: {
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
    to: {
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
    status: {
        type: String,
        optional: true,
        autoform: {
            type: 'select-multi-checkbox-combo',
            options: [
                {label: 'Placing', value: 'placing'},
                {label: 'Confirmed', value: 'confirmed'},
                {label: 'N/A', value: 'n/a'},
            ]
        }
    },
})
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
    }
]


const columns = [
    {
        key: 'guest',
        operator: '$eq',
        operators
    },
    {
        key: 'name',
        operator: '$regex',
    },
    {
        key: 'aussieName',
        operator: '$regex',
    },
    {
        key: 'position',
        operator: '$regex',
    },
    {
        key: 'gender',
        operator: '$in',
    },
    {
        key: 'age',
        operator: '$regex',
    },
    {
        key: 'birthDate',
        operator: '$regex',
    },
    {
        key: 'mobile',
        operator: '$regex',
    },
    {
        key: 'medical',
        operator: '$regex',
    },
    {
        key: 'requirements',
        operator: '$regex',
    },
    {
        key: 'home',
        operator: '$regex',
    },
    {
        key: 'from',
        operator: '$eq',
        operators
    },
    {
        key: 'to',
        operator: '$eq',
        operators
    },
    {
        key: 'status',
        operator: '$in',
    }
]
export const guestAutoTable = new AutoTable({
    id: 'guestAutoTable',
    collection: Guests,
    columns,
    publishExtraFields: [],
    schema: guestsFilterSchema,
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
    link: function (row) {
       // return FlowRouter.path('groupEdit', {groupId: row._id})
    }
})