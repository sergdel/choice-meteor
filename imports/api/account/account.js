/**
 * Created by cesar on 2/12/16.
 */
import  {LocalCollection} from 'meteor/minimongo'
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {AutoTable} from "meteor/cesarve:auto-table";
import {moment} from 'meteor/momentjs:moment'
import {FlowRouter} from 'meteor/kadira:flow-router'



class AccountCollection extends Mongo.Collection {
    insert(account, callback) {
        return super.insert(account, callback);
    }
    remove(_id, callback) {
        return super.remove(_id, callback);
    }
    update(_id, modifier, options) {
        return super.update(_id, modifier, options);
    }
}

const accountSchema = new SimpleSchema({
    date: {
        type: Date,

    },
    description: {
        type: String,

    },
    amount: {
        type: Number,
    },

})
export const Accounts = new AccountCollection('account');

Accounts.deny({
    insert: () => true,
    update: () => true,
    remove: () => true,
})
Accounts.allow({
    insert: () => false,
    update: () => false,
    remove: () => false,
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
        key: 'date',
        operator: '$eq',
        operators,
    },
    {
        key: 'description',
        operator: '$regex',
    },
    {
        key: 'amount',
        operator: '$eq',
        operators,
    },
]


let accountFilterSchema = new SimpleSchema({
    date: {
        type: Date,
        optional: true,
    },
    description: {
        type: String,
        optional: true,
    },
    amount: {
        type: Number,
        optional: true,
    },

})


Accounts.autoTable = new AutoTable(
    {
        id: 'accountAutoTable',
        collection: Accounts,
        columns,
        schema: accountFilterSchema,
        settings: {
            options: {
                columnsSort: true,
                columnsDisplay: false,
                showing: true,
                filters: true,
            },
        },

    }
)
