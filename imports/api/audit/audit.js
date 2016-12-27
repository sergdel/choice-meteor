/**
 * Created by cesar on 16/11/16.
 */
import {Mongo} from 'meteor/mongo'
import {Meteor} from 'meteor/meteor'
import {_} from 'lodash'
import diff from 'recursive-diff'
import {AutoTable} from 'meteor/cesarve:auto-table'
import {familyStatus} from "/imports/api/family/family-status";


class AuditCollection extends Mongo.Collection {
    insert({userId, type, docId, newDoc, oldDoc, familyId, description, where = 'families'}) {
        const user = Meteor.users.findOne(userId)
        const family = Meteor.users.findOne(familyId, {fields: {'office.familyStatus': 1}})
        const familyStatus = family && family.office && family.office.familyStatus
        const name = (user.firstName && user.surname) ? user.firstName + ' ' + user.surname : false || ((user.parents && user.parents[0] && user.parents[0].surname) + ' ' + (user.parents && user.parents[0] && user.parents[0].firstName))
        const role = user.roles.pop()
        if (type == 'update' || type == 'create' || type == 'remove') {
            let result = diff.getDiff(oldDoc, newDoc)
            for (let key in result) {
                let path = key.replace(/\//g, '.').substr(1)
                const regex = /\.(\d*)\./g
                result[key].path = path
                //result[key].field=familySchema.label(path)
                while (regex.test(path)) {
                    path = path.replace(regex, '[$1].')
                }
                path = path.replace(/\.(\d)$/, '[$1]')
                path = path.replace(/\[\.|\]](\d)$/, '[$1]')
                result[key].before = _.get(oldDoc, path)
                result[key].after = _.get(newDoc, path)
            }
            if (!_.isEmpty(result)) {
                return super.insert({
                    type,
                    where,
                    docId,
                    familyId,
                    familyStatus,
                    description,
                    result,
                    role,
                    name,
                    userId,
                    timestamp: new Date()
                });
            }
            return 0
        } else {
            return super.insert({
                type,
                where,
                docId,
                familyId,
                familyStatus,
                description,
                role,
                name,
                userId,
                timestamp: new Date()
            });
        }
    }

    update(selector, modifier, options) {
        return super.update(selector, modifier, options)
    }

    remove() {
        return
    }

    upsert() {
        return
    }

    find(selector, options) {
        return super.find(selector, options)
    }

}

export const Audit = new AuditCollection('auditLog')


const AuditFilterSchema = new SimpleSchema({
    type: {
        type: [String],
        optional: true,
        autoform: {
            type: 'select-multi-checkbox-combo',
            options: [
                {label: 'Accessed', value: 'access'},
                {label: 'Updated', value: 'update'},
                {label: 'Created', value: 'create'},
                {label: 'Removed', value: 'remove'}
            ]
        }
    },
    role: {
        type: [String],
        optional: true,
        autoform: {
            type: 'select-multi-checkbox-combo',
            options: [
                {label: 'Staff', value: 'staff'},
                {label: 'Admin', value: 'admin'},
                {label: 'Family', value: 'family'}],
        }
    },

    userId: {
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
    },
    timestamp: {
        type: Date,
        label: 'Time',
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
    where: {
        type: [String],
        label: 'Where',
        optional: true,
        autoform: {
            type: 'select-multi-checkbox-combo',
            options: [
                {
                    label: "Groups",
                    value: "groups"
                },
                {
                    label: "Families",
                    value: "families"
                },
            ],
        },
    },
    'familyStatus': {
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
})
const operators = [  // Optional Array works for option filter
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

]

export const AuditAutoTable = new AutoTable({
    id: 'Audit',
    columns: [
        {
            key: 'userId', operator: '$in', label: 'Staff',
            render: function (val, path) {
                return this.name
            }
        },
        {key: 'type', operator: '$in', label: 'Type'},
        {key: 'role', operator: '$in', label: 'Role'},
        {
            key: 'timestamp', operator: '$gt', label: 'Time', operators,
            render: function (val) {
                const m = moment(val)
                if (!m.isValid()) return val
                return m.format('Do MMM YYYY H:mm')
            },
        },
        {key: 'where', operator: '$in', label: 'Where'},
        {key: 'description', operator: '$regex', label: 'Detail'},
        {
            key: 'familyStatus', label: 'Status', operator: '$in',
            render: function (val) {
                const status = _.find(familyStatus, {id: val})
                return status && status.label || ''
            }
        }

    ],
    collection: Audit,
    schema: AuditFilterSchema,
    settings: {
        options: {
            columnsDisplay: true,
            columnsSort: true,
            filters: true,
            showing: true,
        },
    },
    publishExtraFields: ['result', 'docId', 'name', 'familyId'],
    publish: function () {
        return Roles.userIsInRole(this.userId, ['admin', 'staff'])
    },
    link: function (doc, key) {
        if (doc.familyId) {
            return FlowRouter.path('familyEdit', {familyId: doc.familyId})
        }
        return ""

    }
})